import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, Language } from "../types";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    asset: { type: Type.STRING, description: "Nama aset yang dianalisis (misal: BTC/USDT)" },
    currentPrice: { type: Type.STRING, description: "Harga saat ini (gunakan estimasi terbaik jika search tidak tersedia)" },
    marketStructure: { 
      type: Type.STRING, 
      enum: ["Trending Bullish", "Trending Bearish", "Ranging", "Correction"],
      description: "Struktur pasar keseluruhan pada Daily/H4"
    },
    marketStructureDetails: { type: Type.STRING, description: "Analisis detail struktur pasar dan tren" },
    levels: {
      type: Type.OBJECT,
      properties: {
        supports: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Level support kunci" },
        resistances: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Level resistance kunci" },
        fibonacci: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Level Fib yang relevan" }
      },
      required: ["supports", "resistances"]
    },
    technicals: {
      type: Type.OBJECT,
      properties: {
        ema: { type: Type.STRING, description: "Analisis EMA 20, 50, 200" },
        momentum: { type: Type.STRING, description: "Analisis RSI/Stochastic" },
        volume: { type: Type.STRING, description: "Analisis profil volume dan likuiditas" },
        volatility: { type: Type.STRING, description: "Analisis ATR atau Bollinger Bands" }
      },
      required: ["ema", "momentum", "volume", "volatility"]
    },
    setup: {
      type: Type.OBJECT,
      properties: {
        signal: { type: Type.STRING, enum: ["LONG", "SHORT", "NEUTRAL"] },
        entryZone: { type: Type.STRING, description: "Zona entry presisi" },
        stopLoss: { type: Type.STRING, description: "Level stop loss logis" },
        takeProfits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Minimal 3 target TP" },
        riskRewardRatio: { type: Type.STRING, description: "Estimasi rasio R:R" }
      },
      required: ["signal", "entryZone", "stopLoss", "takeProfits", "riskRewardRatio"]
    },
    veteranInsight: { type: Type.STRING, description: "Saran spesifik, tips psikologi, atau peringatan 'jebakan' berdasarkan 30 tahun pengalaman." }
  },
  required: ["asset", "marketStructure", "marketStructureDetails", "levels", "technicals", "setup", "veteranInsight"]
};

export const analyzeAsset = async (assetName: string, language: Language): Promise<AnalysisData> => {
  // CRITICAL: Buat instance baru setiap kali fungsi dipanggil untuk menangkap kunci terbaru dari dialog aistudio
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageInstruction = language === 'ID' 
    ? "Berikan semua analisis dalam Bahasa Indonesia. Gunakan istilah teknis dalam bahasa Inggris jika umum namun jelaskan dalam Bahasa Indonesia."
    : "Provide all analysis in English.";

  const basePrompt = `
    Role: Senior Market Strategist & 30-Year Veteran Trader.
    Task: Scan and analyze the asset: ${assetName}.
    
    Instruction: Think deeply about smart money concepts and liquidity before responding.
    Language Requirement: ${languageInstruction}
    Structure: Output MUST be in JSON format matching the provided schema.
  `;

  // Mencoba dengan Google Search Grounding terlebih dahulu
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: basePrompt + " Use Google Search grounding for latest prices and news.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    const data = JSON.parse(text) as AnalysisData;
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls: string[] = [];
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
      });
    }
    
    return { 
      ...data, 
      groundingUrls: Array.from(new Set(groundingUrls)).slice(0, 5),
      isRealTime: true 
    };

  } catch (error: any) {
    console.warn("API Call Failed. Falling back...", error);
    
    // Fallback logic jika permission ditolak atau key bermasalah
    if (error.message?.includes('403') || error.message?.includes('permission') || error.message?.includes('not found')) {
      try {
        // Buat instance baru lagi untuk percobaan tanpa grounding
        const aiFallback = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const fallbackResponse = await aiFallback.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: basePrompt + " (Note: External search is currently limited, use your internal knowledge base).",
          config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
          },
        });

        const fallbackText = fallbackResponse.text;
        if (!fallbackText) throw new Error("Fallback response empty");

        const data = JSON.parse(fallbackText) as AnalysisData;
        return { 
          ...data, 
          isRealTime: false 
        };
      } catch (fallbackError: any) {
        console.error("Critical: Fallback also failed", fallbackError);
        
        // Pesan instruksi spesifik untuk pengguna
        if (fallbackError.message?.includes('403') || fallbackError.message?.includes('not found')) {
          throw new Error("Akses Ditolak: Kunci API Anda tidak valid atau kuota habis. Silakan klik tombol 'Connect' di navigasi atas untuk memilih kunci yang valid.");
        }
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, Language } from "../types";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    asset: { type: Type.STRING, description: "Nama aset (e.g., BTC/USDT)" },
    currentPrice: { type: Type.STRING, description: "Harga terkini dari grounding search" },
    marketStructure: { 
      type: Type.STRING, 
      enum: ["Trending Bullish", "Trending Bearish", "Ranging", "Correction"],
      description: "Struktur pasar makro"
    },
    marketStructureDetails: { type: Type.STRING, description: "Analisis mendalam tentang Price Action dan Market Structure Shift (MSS)" },
    levels: {
      type: Type.OBJECT,
      properties: {
        supports: { type: Type.ARRAY, items: { type: Type.STRING } },
        resistances: { type: Type.ARRAY, items: { type: Type.STRING } },
        fibonacci: { type: Type.ARRAY, items: { type: Type.STRING } },
        institutionalZones: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Order Blocks, FVG, atau Liquidity Pools" }
      },
      required: ["supports", "resistances"]
    },
    technicals: {
      type: Type.OBJECT,
      properties: {
        ema: { type: Type.STRING },
        momentum: { type: Type.STRING },
        volume: { type: Type.STRING },
        volatility: { type: Type.STRING }
      },
      required: ["ema", "momentum", "volume", "volatility"]
    },
    setup: {
      type: Type.OBJECT,
      properties: {
        signal: { type: Type.STRING, enum: ["LONG", "SHORT", "NEUTRAL"] },
        entryZone: { type: Type.STRING },
        stopLoss: { type: Type.STRING },
        takeProfits: { type: Type.ARRAY, items: { type: Type.STRING } },
        riskRewardRatio: { type: Type.STRING }
      },
      required: ["signal", "entryZone", "stopLoss", "takeProfits", "riskRewardRatio"]
    },
    veteranInsight: { type: Type.STRING, description: "Nasihat psikologis dan 'institutional trap' warning." },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          confirmed: { type: Type.BOOLEAN }
        },
        required: ["label", "confirmed"]
      },
      description: "Konfirmasi teknikal (e.g., 'RSI Divergence', 'Volume Spike')"
    }
  },
  required: ["asset", "marketStructure", "marketStructureDetails", "levels", "technicals", "setup", "veteranInsight", "checklist"]
};

export const analyzeAsset = async (assetName: string, language: Language): Promise<AnalysisData> => {
  // Always use process.env.API_KEY as per instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageInstruction = language === 'ID' 
    ? "Analisis dalam Bahasa Indonesia profesional. Gunakan istilah: Liquidity Sweep, MSS, Order Block, FVG."
    : "Professional English analysis. Use: Liquidity Sweep, MSS, Order Block, FVG.";

  const basePrompt = `
    Role: Senior Institutional Trader (30-Year Veteran).
    Task: Analyze ${assetName} using SMC and ICT concepts.
    Requirements:
    - Signal: LONG, SHORT, or NEUTRAL.
    - Focus on 'Institutional Liquidity' and 'Market Structure Shift'.
    - veteranInsight: Real-talk psychological advice.
    Language: ${languageInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: basePrompt + " Use Google Search grounding for real-time price and sentiment.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Terminal link failed to receive data.");

    const data = JSON.parse(text) as AnalysisData;
    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter(Boolean) || [];
    
    return { 
      ...data, 
      groundingUrls: Array.from(new Set(groundingUrls as string[])).slice(0, 5),
      isRealTime: true 
    };

  } catch (error: any) {
    // Fallback if grounding fails to prevent total failure
    console.warn("Secondary sensor data required...", error);
    
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: basePrompt + " (Grounding unavailable, use internal market intelligence).",
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
        },
      });

      return { 
        ...JSON.parse(fallbackResponse.text), 
        isRealTime: false 
      };
    } catch (fallbackError: any) {
      throw new Error("Sistem Offline: Gagal memvalidasi kredensial terminal. Periksa konfigurasi API_KEY di Vercel Dashboard.");
    }
  }
};

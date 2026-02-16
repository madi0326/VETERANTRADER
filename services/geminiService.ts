
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageInstruction = language === 'ID' 
    ? "Berikan analisis dalam Bahasa Indonesia yang sangat profesional. Gunakan terminologi trader veteran seperti 'Likuiditas', 'Order Block', 'Smart Money Flow'."
    : "Provide a highly professional analysis in English using veteran terminology like 'Liquidity', 'Order Blocks', 'Smart Money Flow'.";

  const basePrompt = `
    Role: You are a 30-Year Veteran Market Strategist & Institutional Trader.
    Expertise: Price Action, Smart Money Concepts (SMC), ICT, and Macro Sentiment.
    Task: Analyze the asset: ${assetName}.
    
    Guidelines:
    - Be brutally honest. If there is no trade, signal NEUTRAL.
    - Identify 'liquidity sweeps' and 'fair value gaps'.
    - Provide logical stop losses based on structure, not percentages.
    - The 'veteranInsight' should feel like a private advisory from a mentor.
    
    Language: ${languageInstruction}
    Format: Output MUST be strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: basePrompt + " Use Google Search grounding to find real-time prices, news, and sentiment.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");

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
    console.warn("Primary API Call Failed. Using fallback...", error);
    
    const fallbackResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: basePrompt + " (Search grounding unavailable, use internal knowledge).",
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const fallbackText = fallbackResponse.text;
    if (!fallbackText) throw new Error("Fallback empty");

    return { 
      ...JSON.parse(fallbackText), 
      isRealTime: false 
    };
  }
};

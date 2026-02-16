
export type Language = 'EN' | 'ID';

export interface TradeSetup {
  signal: 'LONG' | 'SHORT' | 'NEUTRAL';
  entryZone: string;
  stopLoss: string;
  takeProfits: string[];
  riskRewardRatio: string;
}

export interface MarketLevels {
  supports: string[];
  resistances: string[];
  fibonacci: string[];
}

export interface Technicals {
  ema: string;
  momentum: string;
  volume: string;
  volatility: string;
}

export interface AnalysisData {
  asset: string;
  currentPrice?: string;
  marketStructure: 'Trending Bullish' | 'Trending Bearish' | 'Ranging' | 'Correction';
  marketStructureDetails: string;
  levels: MarketLevels;
  technicals: Technicals;
  setup: TradeSetup;
  veteranInsight: string;
  groundingUrls?: string[];
  isRealTime?: boolean; // True jika pencarian Google berhasil
}

export enum LoadingState {
  IDLE,
  SCANNING_MARKET,
  ANALYZING_STRUCTURE,
  CALCULATING_LEVELS,
  COMPLETE,
  ERROR
}

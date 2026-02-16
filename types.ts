
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
  institutionalZones?: string[]; // Supply/Demand or Order Blocks
}

export interface Technicals {
  ema: string;
  momentum: string;
  volume: string;
  volatility: string;
}

export interface ChecklistItem {
  label: string;
  confirmed: boolean;
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
  checklist: ChecklistItem[];
  groundingUrls?: string[];
  isRealTime?: boolean;
}

export enum LoadingState {
  IDLE,
  SCANNING_MARKET,
  ANALYZING_STRUCTURE,
  CALCULATING_LEVELS,
  COMPLETE,
  ERROR
}

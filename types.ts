
export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TrendDirection = 'UP' | 'DOWN' | 'WAIT';
export type Timeframe = '1m' | '5m' | '10m' | '15m' | '30m' | '1h';

export interface AIAnalysis {
  pattern: string;
  direction: TrendDirection;
  confidence: number;
  explanation: string;
  recommendedExpiration: string;
  nextCandleProbability: number;
  keyLevels: {
    support: number;
    resistance: number;
  };
}

export interface HistoricalPrediction extends AIAnalysis {
  id: string;
  symbol: string;
  timeframe: Timeframe;
  timestamp: number;
  entryPrice: number;
  status: 'WIN' | 'LOSS' | 'PENDING';
  actualResult?: number;
}

export type AssetCategory = 'Major' | 'Minor' | 'Exotic' | 'Crypto' | 'Commodity';

export interface CurrencyPair {
  symbol: string;
  name: string;
  category: AssetCategory;
}

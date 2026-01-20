
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

export interface CurrencyPair {
  symbol: string;
  name: string;
  category: 'Major' | 'Minor' | 'Exotic';
}

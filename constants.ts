
import { CurrencyPair } from './types';

export const GEMINI_MODEL = 'gemini-3-flash-preview';

export const CURRENCY_PAIRS: CurrencyPair[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Major' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Major' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Major' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'Major' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'Major' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'Major' },
  { symbol: 'NZD/USD', name: 'NZ Dollar / US Dollar', category: 'Major' },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'Minor' },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'Minor' },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'Minor' },
  { symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', category: 'Minor' },
  { symbol: 'EUR/AUD', name: 'Euro / Australian Dollar', category: 'Minor' },
  { symbol: 'GBP/AUD', name: 'British Pound / Australian Dollar', category: 'Minor' },
  { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', category: 'Exotic' },
  { symbol: 'USD/SGD', name: 'US Dollar / Singapore Dollar', category: 'Exotic' },
  { symbol: 'USD/HKD', name: 'US Dollar / Hong Kong Dollar', category: 'Exotic' },
];

export const INITIAL_PAIR = CURRENCY_PAIRS[0];

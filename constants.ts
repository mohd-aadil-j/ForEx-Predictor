
import { CurrencyPair } from './types';

export const GEMINI_MODEL = 'gemini-3-flash-preview';

export const CURRENCY_PAIRS: CurrencyPair[] = [
  // Majors
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Major' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Major' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Major' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'Major' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'Major' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'Major' },
  { symbol: 'NZD/USD', name: 'NZ Dollar / US Dollar', category: 'Major' },
  
  // Minors / Crosses
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'Minor' },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'Minor' },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'Minor' },
  { symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', category: 'Minor' },
  { symbol: 'EUR/AUD', name: 'Euro / Australian Dollar', category: 'Minor' },
  { symbol: 'GBP/AUD', name: 'British Pound / Australian Dollar', category: 'Minor' },
  { symbol: 'AUD/CAD', name: 'Australian Dollar / Canadian Dollar', category: 'Minor' },
  { symbol: 'AUD/CHF', name: 'Australian Dollar / Swiss Franc', category: 'Minor' },
  { symbol: 'AUD/NZD', name: 'Australian Dollar / NZ Dollar', category: 'Minor' },
  { symbol: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', category: 'Minor' },
  { symbol: 'CHF/JPY', name: 'Swiss Franc / Japanese Yen', category: 'Minor' },
  { symbol: 'EUR/CAD', name: 'Euro / Canadian Dollar', category: 'Minor' },
  { symbol: 'EUR/CHF', name: 'Euro / Swiss Franc', category: 'Minor' },
  { symbol: 'EUR/NZD', name: 'Euro / NZ Dollar', category: 'Minor' },
  { symbol: 'GBP/CAD', name: 'British Pound / Canadian Dollar', category: 'Minor' },
  { symbol: 'GBP/CHF', name: 'British Pound / Swiss Franc', category: 'Minor' },
  { symbol: 'GBP/NZD', name: 'British Pound / NZ Dollar', category: 'Minor' },
  { symbol: 'NZD/JPY', name: 'NZ Dollar / Japanese Yen', category: 'Minor' },
  { symbol: 'NZD/CAD', name: 'NZ Dollar / Canadian Dollar', category: 'Minor' },
  { symbol: 'NZD/CHF', name: 'NZ Dollar / Swiss Franc', category: 'Minor' },
  { symbol: 'CAD/CHF', name: 'Canadian Dollar / Swiss Franc', category: 'Minor' },
  
  // Exotics
  { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', category: 'Exotic' },
  { symbol: 'USD/SGD', name: 'US Dollar / Singapore Dollar', category: 'Exotic' },
  { symbol: 'USD/HKD', name: 'US Dollar / Hong Kong Dollar', category: 'Exotic' },
  { symbol: 'USD/TRY', name: 'US Dollar / Turkish Lira', category: 'Exotic' },
  { symbol: 'USD/MXN', name: 'US Dollar / Mexican Peso', category: 'Exotic' },
  { symbol: 'USD/NOK', name: 'US Dollar / Norwegian Krone', category: 'Exotic' },
  { symbol: 'USD/SEK', name: 'US Dollar / Swedish Krona', category: 'Exotic' },
  { symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', category: 'Exotic' },
  { symbol: 'USD/BRL', name: 'US Dollar / Brazilian Real', category: 'Exotic' },
  { symbol: 'USD/PLN', name: 'US Dollar / Polish Zloty', category: 'Exotic' },
  { symbol: 'USD/CNH', name: 'US Dollar / Offshore Yuan', category: 'Exotic' },
  { symbol: 'USD/CZK', name: 'US Dollar / Czech Koruna', category: 'Exotic' },
  { symbol: 'USD/HUF', name: 'US Dollar / Hungarian Forint', category: 'Exotic' },

  // Crypto
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'Crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'Crypto' },
  { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'Crypto' },
  { symbol: 'XRP/USD', name: 'Ripple / US Dollar', category: 'Crypto' },
];

export const INITIAL_PAIR = CURRENCY_PAIRS[0];

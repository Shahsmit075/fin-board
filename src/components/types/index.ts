export interface Widget {
  id: string;
  company: string;
  dataType: string;
  intraday?: {
    outputSize: 'compact' | 'full';
    month?: string;
  };
}

export interface StockData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ApiResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Interval'?: string;
    '5. Output Size'?: string;
    '6. Time Zone': string;
  };
  [key: string]: any;
}
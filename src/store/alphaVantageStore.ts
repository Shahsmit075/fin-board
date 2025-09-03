import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AlphaVantageWidget {
  id: string;
  symbol: string;
  interval: 'daily' | 'weekly' | 'monthly' | '5min' | '15min' | '30min' | '60min';
  function: 'TIME_SERIES_DAILY' | 'TIME_SERIES_WEEKLY' | 'TIME_SERIES_MONTHLY' | 'TIME_SERIES_INTRADAY';
}

export interface AlphaVantageData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AlphaVantageMetaData {
  information: string;
  symbol: string;
  lastRefreshed: string;
  interval?: string;
  outputSize?: string;
  timeZone: string;
}

interface AlphaVantageState {
  // API Key Management
  apiKey: string | null;
  setApiKey: (key: string) => void;
  
  // Widget Management
  widgets: AlphaVantageWidget[];
  addWidget: (symbol: string, interval: AlphaVantageWidget['interval']) => void;
  removeWidget: (id: string) => void;
  
  // UI State
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const getFunctionFromInterval = (interval: AlphaVantageWidget['interval']): AlphaVantageWidget['function'] => {
  switch (interval) {
    case 'daily':
      return 'TIME_SERIES_DAILY';
    case 'weekly':
      return 'TIME_SERIES_WEEKLY';
    case 'monthly':
      return 'TIME_SERIES_MONTHLY';
    case '5min':
    case '15min':
    case '30min':
    case '60min':
      return 'TIME_SERIES_INTRADAY';
    default:
      return 'TIME_SERIES_DAILY';
  }
};

export const useAlphaVantageStore = create<AlphaVantageState>()(
  persist(
    (set) => ({
      // API Key Management
      apiKey: null,
      setApiKey: (key: string) => set({ apiKey: key }),
      
      // Widget Management
      widgets: [],
      addWidget: (symbol: string, interval: AlphaVantageWidget['interval']) =>
        set((state) => ({
          widgets: [
            ...state.widgets,
            {
              id: `av-widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              symbol: symbol.toUpperCase(),
              interval,
              function: getFunctionFromInterval(interval),
            },
          ],
        })),
      removeWidget: (id: string) =>
        set((state) => ({
          widgets: state.widgets.filter((widget) => widget.id !== id),
        })),
      
      // UI State
      isAddModalOpen: false,
      setIsAddModalOpen: (open: boolean) => set({ isAddModalOpen: open }),
    }),
    {
      name: 'alphavantage-dashboard-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        widgets: state.widgets,
      }),
    }
  )
);
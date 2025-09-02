import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuoteWidget {
  id: string;
  symbol: string;
}

export interface QuoteData {
  c: number; // current price
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
  t: number; // timestamp
}

interface DashboardState {
  // API Key Management
  apiKey: string | null;
  setApiKey: (key: string) => void;
  
  // Widget Management
  widgets: QuoteWidget[];
  addWidget: (symbol: string) => void;
  removeWidget: (id: string) => void;
  
  // UI State
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // API Key Management
      apiKey: null,
      setApiKey: (key: string) => set({ apiKey: key }),
      
      // Widget Management
      widgets: [],
      addWidget: (symbol: string) => 
        set((state) => ({
          widgets: [
            ...state.widgets,
            {
              id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              symbol: symbol.toUpperCase(),
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
      name: 'finnhub-dashboard-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        widgets: state.widgets,
      }),
    }
  )
);
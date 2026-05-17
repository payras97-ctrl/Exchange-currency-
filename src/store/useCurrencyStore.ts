import { create } from 'zustand';
import { currencyApi } from '@/services/currencyApi';

interface CurrencyState {
  currencies: Record<string, string>;
  isLoadingCurrencies: boolean;
  currenciesError: string | null;
  fromCurrency: string;
  toCurrency: string;
  amount: number | string;
  
  setFromCurrency: (currency: string) => void;
  setToCurrency: (currency: string) => void;
  setAmount: (amount: number | string) => void;
  swapCurrencies: () => void;
  fetchCurrencies: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currencies: {},
  isLoadingCurrencies: false,
  currenciesError: null,
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  amount: 1000,
  
  setFromCurrency: (currency) => set({ fromCurrency: currency }),
  setToCurrency: (currency) => set({ toCurrency: currency }),
  setAmount: (amount) => set({ amount }),
  swapCurrencies: () => {
    const { fromCurrency, toCurrency } = get();
    set({ fromCurrency: toCurrency, toCurrency: fromCurrency });
  },
  
  fetchCurrencies: async () => {
    set({ isLoadingCurrencies: true, currenciesError: null });
    try {
      const data = await currencyApi.getCurrencies();
      set({ currencies: data, isLoadingCurrencies: false });
    } catch (error) {
      set({ 
        currenciesError: error instanceof Error ? error.message : 'Unknown error',
        isLoadingCurrencies: false
      });
    }
  }
}));

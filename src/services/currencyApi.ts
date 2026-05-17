import axios from 'axios';

const api = axios.create({
  baseURL: '/api/frankfurter',
  timeout: 10000,
});

export interface ExchangeRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CurrenciesResponse {
  [currencyCode: string]: string;
}

export const currencyApi = {
  getCurrencies: async (): Promise<CurrenciesResponse> => {
    try {
      const response = await api.get<CurrenciesResponse>('/currencies');
      return response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw new Error('Failed to fetch currencies. Please try again later.');
    }
  },

  getLatestRates: async (from = 'USD'): Promise<ExchangeRatesResponse> => {
    try {
      const response = await api.get<ExchangeRatesResponse>(`/latest?base=${from}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest rates:', error);
      throw new Error('Failed to fetch latest exchange rates.');
    }
  },

  convertCurrency: async (amount: number, from: string, to: string): Promise<ExchangeRatesResponse> => {
    if (from === to) {
      return {
        amount,
        base: from,
        date: new Date().toISOString().split('T')[0],
        rates: { [to]: 1 }
      };
    }
    
    try {
      const response = await api.get<ExchangeRatesResponse>(`/latest?amount=${amount}&base=${from}&symbols=${to}`);
      return response.data;
    } catch (error) {
      console.error('Error converting currency:', error);
      const message = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'Conversion failed. Please try again.';
      throw new Error(message);
    }
  }
};

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { currencyApi } from '@/services/currencyApi';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFlagEmoji } from '@/utils/currencyUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrencyStore } from '@/store/useCurrencyStore';

const MAJOR_CURRENCIES = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

export function LiveRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const { fromCurrency } = useCurrencyStore();

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const data = await currencyApi.getLatestRates(fromCurrency);
        setRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch live rates", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Don't fetch if no fromCurrency
    if (fromCurrency) {
      fetchRates();
    }
  }, [fromCurrency]);

  return (
    <section className="w-full max-w-5xl mx-auto mt-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight mb-2">Live Exchange Rates</h2>
          <p className="text-muted-foreground">Real-time mid-market exchange rate relative to <Badge variant="secondary" className="ml-1 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary">{getFlagEmoji(fromCurrency)} {fromCurrency}</Badge></p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-full border border-border/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live updating
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-5 glass-card">
              <Skeleton className="h-6 w-16 mb-4" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ))
        ) : rates ? (
          MAJOR_CURRENCIES.map((currency, index) => {
            if (currency === fromCurrency) return null;
            const rate = rates[currency];
            if (!rate) return null;

            return (
              <motion.div
                key={currency}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 glass-card hover:bg-accent/30 transition-colors border-border/40 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-5xl right-[-10px] top-[-10px]">
                    {getFlagEmoji(currency)}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl shadow-sm bg-background rounded-full leading-none">{getFlagEmoji(currency)}</span>
                    <span className="font-semibold text-muted-foreground">{currency}</span>
                  </div>
                  <div className="text-2xl font-light tracking-tight">
                    {rate.toFixed(4)}
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-accent/20 rounded-2xl border border-dashed border-border/50">
            Failed to load live rates.
          </div>
        )}
      </div>
    </section>
  );
}

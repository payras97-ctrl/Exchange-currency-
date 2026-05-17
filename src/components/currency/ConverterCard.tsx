import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftRight, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useCurrencyStore } from '@/store/useCurrencyStore';
import { currencyApi, ExchangeRatesResponse } from '@/services/currencyApi';
import { formatCurrency, getFlagEmoji } from '@/utils/currencyUtils';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrencySelector } from './CurrencySelector';

export function ConverterCard() {
  const { 
    currencies, 
    fromCurrency, 
    toCurrency, 
    amount, 
    setFromCurrency, 
    setToCurrency, 
    setAmount,
    swapCurrencies 
  } = useCurrencyStore();

  const [result, setResult] = useState<ExchangeRatesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleTextareaResize();
  }, [amount]);

  // Debounced conversion
  useEffect(() => {
    const convert = async () => {
      const numAmount = Number(amount);
      if (!numAmount || numAmount <= 0 || Object.keys(currencies).length === 0) {
        setResult(null);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await currencyApi.convertCurrency(numAmount, fromCurrency, toCurrency);
        setResult(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Conversion failed');
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(convert, 500);
    return () => clearTimeout(timeoutId);
  }, [amount, fromCurrency, toCurrency, currencies]);

  const handleSwap = () => {
    setIsRotating(true);
    swapCurrencies();
    setTimeout(() => setIsRotating(false), 300);
  };

  const currentRate = result?.rates[toCurrency];
  const convertedValue = currentRate ? currentRate : 0;

  return (
    <Card className="glass-card w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-[32px] overflow-hidden relative z-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20 -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="space-y-6 relative">
        <div className="flex flex-col gap-2 bg-secondary/50 dark:bg-white/5 p-4 sm:p-5 rounded-3xl border border-border/50 dark:border-white/5 hover:border-primary/30 transition-all shadow-sm">
          <div className="flex justify-between items-center w-full">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Amount</label>
            <CurrencySelector 
              value={fromCurrency} 
              onChange={setFromCurrency} 
              currencies={currencies} 
            />
          </div>
          <div className="relative w-full pt-2">
            <span className="absolute left-1 top-4 text-2xl sm:text-3xl font-medium text-foreground/40 pointer-events-none">
              {getFlagEmoji(fromCurrency)}
            </span>
            <textarea
              ref={textareaRef}
              rows={1}
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                const parts = val.split('.');
                const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : val;
                setAmount(sanitized);
              }}
              onInput={handleTextareaResize}
              className="w-full text-4xl sm:text-5xl font-bold h-auto py-2 px-0 pl-11 sm:pl-12 bg-transparent border-none focus-visible:ring-0 focus:outline-none text-foreground placeholder:text-foreground/20 resize-none block break-all leading-tight"
              placeholder="0.00"
              style={{ minHeight: '60px' }}
            />
          </div>
        </div>

        <div className="relative flex justify-center -my-6 z-20">
          <motion.div
            animate={{ rotate: isRotating ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="h-14 w-14 rounded-full border-4 shadow-xl hover:scale-110 active:rotate-180 transition-all bg-primary text-primary-foreground border-background dark:border-[#0F0F0F]"
            >
              <ArrowLeftRight className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>

        <div className="flex flex-col gap-2 bg-primary/5 dark:bg-white/5 p-4 sm:p-5 rounded-3xl border border-primary/10 dark:border-white/5 hover:border-primary/30 transition-all shadow-sm">
          <div className="flex justify-between items-center w-full">
            <label className="text-xs font-bold text-primary/70 dark:text-muted-foreground uppercase tracking-widest pl-1">Converted</label>
            <CurrencySelector 
              value={toCurrency} 
              onChange={setToCurrency} 
              currencies={currencies} 
            />
          </div>
          <div className="relative w-full pt-2 min-h-[60px] flex items-center">
            {isLoading ? (
              <Skeleton className="h-12 w-1/2 rounded-xl bg-primary/10 ml-2" />
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`${convertedValue}-${toCurrency}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-4xl sm:text-5xl font-bold text-primary dark:text-foreground break-all w-full py-2 pl-1 whitespace-pre-wrap leading-tight"
                >
                  {formatCurrency(convertedValue, toCurrency)}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground border-t border-border/40">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : currentRate ? (
              <span className="font-medium animate-in fade-in">
                1 {fromCurrency} = <span className="text-foreground">{currentRate} {toCurrency}</span>
              </span>
            ) : (
              <span>Enter an amount to convert</span>
            )}
          </div>
          
          {result?.date && !isLoading && (
            <div className="flex items-center gap-2 opacity-70 text-xs font-mono">
              <AlertCircle className="h-3 w-3" />
              Mid-market rate • {result.date}
            </div>
          )}
        </div>

        <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-2">
          Convert Instantly
        </Button>
      </div>
    </Card>
  );
}

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { ConverterCard } from '@/components/currency/ConverterCard';
import { LiveRates } from '@/components/sections/LiveRates';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Globe2, Zap, ShieldCheck, LineChart, Layers, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Home() {
  const { fetchCurrencies, currenciesError } = useCurrencyStore();

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16 mt-4 sm:mt-12 w-full max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-center"
        >
          <Badge variant="outline" className="glass py-1.5 px-4 rounded-full border-primary/20 text-primary uppercase tracking-widest text-xs font-semibold shadow-sm">
            Fast • Secure • Accurate
          </Badge>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl font-semibold tracking-tighter leading-[1.1] mb-6 text-foreground"
        >
          Exchange with <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">
            confidence.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light"
        >
          Real-time exchange rates for over 30 global currencies, updated instantly. Get the mid-market rate with zero hidden fees.
        </motion.p>
      </div>

      {currenciesError ? (
        <Alert variant="destructive" className="max-w-2xl w-full mb-8 glass border-red-500/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {currenciesError}. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="convert" className="w-full max-w-2xl mt-4">
        <div className="flex justify-center mb-8">
          <TabsList className="glass bg-background/50 border border-border pb-0.5">
            <TabsTrigger value="convert" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">Convert</TabsTrigger>
            <TabsTrigger value="charts" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">Charts <Badge variant="secondary" className="ml-2 text-[10px] uppercase font-bold py-0 h-4 bg-primary/10">Pro</Badge></TabsTrigger>
            <TabsTrigger value="compare" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">Compare <Badge variant="secondary" className="ml-2 text-[10px] uppercase font-bold py-0 h-4 bg-primary/10">Pro</Badge></TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="convert" className="mt-0 outline-none space-y-6">
          {/* Main Converter Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="w-full relative"
          >
            <ConverterCard />
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 w-full"
          >
            <div className="bg-secondary/50 dark:bg-white/5 border border-border/50 dark:border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Daily High</p>
              <p className="text-lg font-bold">1.0852</p>
            </div>
            <div className="bg-secondary/50 dark:bg-white/5 border border-border/50 dark:border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Daily Low</p>
              <p className="text-lg font-bold">1.0740</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[10px] text-primary uppercase tracking-widest mb-1 font-bold">Market Cap</p>
              <p className="text-lg font-bold text-primary">$1.2T</p>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="charts" className="mt-0 outline-none">
          <div className="glass-card w-full p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 border-dashed">
             <div className="p-4 rounded-full bg-primary/5 text-primary mb-2">
                <LineChart className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-semibold">Historical Charts</h3>
             <p className="text-muted-foreground w-3/4">Track multiple currency pairs over time with advanced candlestick patterns and historical data matching.</p>
             <Badge className="mt-4">Coming in v2.0</Badge>
          </div>
        </TabsContent>
        
        <TabsContent value="compare" className="mt-0 outline-none">
          <div className="glass-card w-full p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 border-dashed">
             <div className="p-4 rounded-full bg-primary/5 text-primary mb-2">
                <Layers className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-semibold">Multi-currency Comparison</h3>
             <p className="text-muted-foreground w-3/4">Convert against up to 10 separate base currencies simultaneously to balance your global portfolio.</p>
             <Badge className="mt-4">Coming in v2.0</Badge>
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 px-4"
      >
        <div className="flex flex-col items-center text-center p-8 rounded-[32px] glass-card border border-white/5">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Global Coverage</h3>
          <p className="text-sm text-muted-foreground">Access major international currencies supported by the European Central Bank.</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-8 rounded-[32px] glass-card border border-white/5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Real-time Rates</h3>
          <p className="text-sm text-muted-foreground">Rates are updated every working day around 16:00 CET for absolute accuracy.</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-8 rounded-[32px] glass-card border border-white/5">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">Your data never leaves your device. No accounts, no tracking, just fast conversions.</p>
        </div>
      </motion.div>

      <LiveRates />
    </div>
  );
}

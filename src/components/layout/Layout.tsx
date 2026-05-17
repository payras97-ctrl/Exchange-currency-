import { ReactNode } from 'react';
import { Moon, Sun, Wallet } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 p-64 bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] left-0 p-64 bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-xl bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-semibold text-lg sm:text-xl tracking-tight"
          >
            <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg border border-primary/20">
              <Wallet className="w-5 h-5" />
            </div>
            Vault<span className="text-primary/60 font-light hidden sm:inline">Exchange</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground mr-4">
              <span className="text-foreground transition-colors cursor-pointer">Converter</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Live Rates</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">API Docs</span>
            </nav>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full w-9 h-9 border border-border/50 bg-background/50 hover:bg-accent"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 md:py-20 flex flex-col items-center">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-background/40 backdrop-blur-lg py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Vault Exchange. Built with React & Vite.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs opacity-60">Powered by Frankfurter API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

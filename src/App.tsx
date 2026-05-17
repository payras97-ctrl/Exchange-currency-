import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/theme-provider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vault-theme">
      <Layout>
        <Home />
      </Layout>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: 'glass-card border-none shadow-xl bg-background text-foreground',
          style: {
            borderRadius: '16px',
            padding: '16px',
          }
        }} 
      />
    </ThemeProvider>
  );
}


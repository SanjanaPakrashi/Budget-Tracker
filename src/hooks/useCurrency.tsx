
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const defaultCurrency: Currency = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);

  // Load user currency preference
  useEffect(() => {
    if (user) {
      try {
        const savedCurrency = localStorage.getItem(`currency_${user.id}`);
        if (savedCurrency) {
          const parsed = JSON.parse(savedCurrency);
          // Ensure it's always INR
          if (parsed.code === 'INR') {
            setCurrency(parsed);
          } else {
            setCurrency(defaultCurrency);
            localStorage.setItem(`currency_${user.id}`, JSON.stringify(defaultCurrency));
          }
        }
      } catch (error) {
        console.error('Error loading currency settings:', error);
        toast({
          title: "Error",
          description: "Failed to load currency preferences.",
          variant: "destructive",
        });
      }
    }
  }, [user, toast]);

  // Save currency preference when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`currency_${user.id}`, JSON.stringify(currency));
    }
  }, [currency, user]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

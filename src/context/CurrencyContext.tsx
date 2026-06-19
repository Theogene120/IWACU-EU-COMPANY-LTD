import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Currency } from '../types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Basic conversion rates (RWF is base)
const CONVERSION_RATES: Record<Currency, number> = {
  RWF: 1,
  USD: 1 / 1460,
  EUR: 1 / 1712,
  KES: 1 / 11,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  RWF: 'RWF',
  USD: '$',
  EUR: '€',
  KES: 'KSh',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'RWF';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const formatPrice = useCallback((price: number) => {
    const converted = price * CONVERSION_RATES[currency];
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (currency === 'RWF') {
      return `${price.toLocaleString()} ${symbol}`;
    }
    
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  const value = useMemo(() => ({
    currency,
    setCurrency,
    formatPrice,
  }), [currency, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};

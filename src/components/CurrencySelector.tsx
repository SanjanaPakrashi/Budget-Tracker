
import React from 'react';
import { useCurrency } from '@/hooks/useCurrency';

// Only Indian Rupee is available now
const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const CurrencySelector = () => {
  const { currency } = useCurrency();

  return (
    <div className="px-3 mt-2">
      <p className="text-sm text-muted-foreground mb-2">Currency: {currency.symbol} {currency.name}</p>
    </div>
  );
};

export default CurrencySelector;

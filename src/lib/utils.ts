import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CurrencyCode, CurrencyRates } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEFAULT_RATES: CurrencyRates = {
  USD: 1,
  CDF: 2800,
  EUR: 0.92,
};

export const formatCurrency = (amount: number, currency: CurrencyCode) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'CDF' ? 0 : 2,
  }).format(amount);
};

export const convertAmount = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: CurrencyRates
) => {
  const inUSD = amount / rates[from];
  return inUSD * rates[to];
};
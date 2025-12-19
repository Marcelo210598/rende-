"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getExchangeRate } from '@/lib/priceService';

export type Currency = 'BRL' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    exchangeRate: number;
    isLoading: boolean;
    toggleCurrency: () => void;
    setCurrency: (currency: Currency) => void;
    convertToBRL: (value: number) => number;
    convertToUSD: (value: number) => number;
    formatCurrency: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('BRL');
    const [exchangeRate, setExchangeRate] = useState<number>(5.0);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load currency preference from localStorage only once
    useEffect(() => {
        setMounted(true);
        const savedCurrency = localStorage.getItem('preferred_currency') as Currency;
        if (savedCurrency === 'BRL' || savedCurrency === 'USD') {
            setCurrencyState(savedCurrency);
        }
    }, []);

    // Fetch exchange rate on mount and periodically
    useEffect(() => {
        if (!mounted) return;

        const fetchRate = async () => {
            setIsLoading(true);
            try {
                const rate = await getExchangeRate();
                setExchangeRate(rate);
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRate();

        // Update exchange rate every 5 minutes
        const interval = setInterval(fetchRate, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [mounted]);

    const toggleCurrency = () => {
        const newCurrency = currency === 'BRL' ? 'USD' : 'BRL';
        setCurrencyState(newCurrency);
        localStorage.setItem('preferred_currency', newCurrency);
    };

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('preferred_currency', newCurrency);
    };

    const convertToBRL = (value: number): number => {
        return currency === 'USD' ? value * exchangeRate : value;
    };

    const convertToUSD = (value: number): number => {
        return currency === 'BRL' ? value / exchangeRate : value;
    };

    const formatCurrency = (value: number): string => {
        if (currency === 'USD') {
            const usdValue = value / exchangeRate;
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(usdValue);
        } else {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value);
        }
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                exchangeRate,
                isLoading,
                toggleCurrency,
                setCurrency,
                convertToBRL,
                convertToUSD,
                formatCurrency,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

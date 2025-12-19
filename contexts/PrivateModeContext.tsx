"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PrivateModeContextType {
    isPrivate: boolean;
    togglePrivateMode: () => void;
    formatValue: (value: number, isCurrency?: boolean) => string;
}

const PrivateModeContext = createContext<PrivateModeContextType | undefined>(undefined);

export function PrivateModeProvider({ children }: { children: ReactNode }) {
    const [isPrivate, setIsPrivate] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load private mode preference from localStorage
    useEffect(() => {
        setMounted(true);
        const savedMode = localStorage.getItem('private_mode');
        if (savedMode === 'true') {
            setIsPrivate(true);
        }
    }, []);

    const togglePrivateMode = () => {
        const newMode = !isPrivate;
        setIsPrivate(newMode);
        localStorage.setItem('private_mode', String(newMode));
    };

    const formatValue = (value: number, isCurrency: boolean = true): string => {
        if (!mounted) return '...';
        if (isPrivate) return '••••••';

        if (isCurrency) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value);
        }

        return value.toFixed(2);
    };

    return (
        <PrivateModeContext.Provider
            value={{
                isPrivate,
                togglePrivateMode,
                formatValue,
            }}
        >
            {children}
        </PrivateModeContext.Provider>
    );
}

export function usePrivateMode() {
    const context = useContext(PrivateModeContext);
    if (context === undefined) {
        throw new Error('usePrivateMode must be used within a PrivateModeProvider');
    }
    return context;
}

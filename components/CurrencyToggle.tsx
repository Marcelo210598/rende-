"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import { DollarSign } from "lucide-react";
import GlassCard from "./ui/GlassCard";

export default function CurrencyToggle() {
    const { currency, exchangeRate, isLoading, toggleCurrency } = useCurrency();

    return (
        <GlassCard className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold">Moeda</p>
                    <p className="text-xs text-gray-400">
                        {isLoading ? 'Carregando...' : `1 USD = R$ ${exchangeRate.toFixed(2)}`}
                    </p>
                </div>
            </div>

            <button
                onClick={toggleCurrency}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${currency === 'USD'
                        ? 'bg-gradient-to-r from-primary to-primary-light'
                        : 'bg-gray-700'
                    }`}
                disabled={isLoading}
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${currency === 'USD' ? 'translate-x-9' : 'translate-x-1'
                        }`}
                />
                <span className={`absolute left-2 text-xs font-bold ${currency === 'BRL' ? 'text-white' : 'text-gray-400'}`}>
                    R$
                </span>
                <span className={`absolute right-2 text-xs font-bold ${currency === 'USD' ? 'text-white' : 'text-gray-400'}`}>
                    US$
                </span>
            </button>
        </GlassCard>
    );
}

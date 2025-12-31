"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
    month: number;
    year: number;
    onChange: (month: number, year: number) => void;
    maxDate?: Date;
}

const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function MonthSelector({ month, year, onChange, maxDate }: MonthSelectorProps) {
    const currentDate = new Date();
    const max = maxDate || currentDate;

    const handlePrevious = () => {
        if (month === 1) {
            onChange(12, year - 1);
        } else {
            onChange(month - 1, year);
        }
    };

    const handleNext = () => {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;

        // Don't allow future months beyond maxDate
        const nextDate = new Date(nextYear, nextMonth - 1, 1);
        if (nextDate > max) return;

        onChange(nextMonth, nextYear);
    };

    const isNextDisabled = () => {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextDate = new Date(nextYear, nextMonth - 1, 1);
        return nextDate > max;
    };

    return (
        <div className="flex items-center justify-between bg-dark-card/30 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3">
            <button
                onClick={handlePrevious}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                aria-label="Mês anterior"
            >
                <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>

            <div className="text-center min-w-[160px]">
                <h3 className="text-lg font-semibold text-white">
                    {MONTHS[month - 1]}
                </h3>
                <p className="text-sm text-white/50">{year}</p>
            </div>

            <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Próximo mês"
            >
                <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
        </div>
    );
}

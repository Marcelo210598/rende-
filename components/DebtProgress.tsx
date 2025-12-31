"use client";

import { Check, Circle } from "lucide-react";

interface DebtProgressProps {
    totalInstallments: number;
    paidInstallments: number;
    currentInstallment: number;
}

export default function DebtProgress({
    totalInstallments,
    paidInstallments,
    currentInstallment
}: DebtProgressProps) {
    const segments = Array.from({ length: totalInstallments }, (_, i) => i + 1);
    const progressPercentage = (paidInstallments / totalInstallments) * 100;

    return (
        <div className="space-y-4">
            {/* Overall Progress */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                        {paidInstallments} de {totalInstallments} pagas
                    </span>
                    <span className="text-sm font-bold text-accent-green">
                        {progressPercentage.toFixed(0)}%
                    </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                <div className="flex items-center justify-between">
                    {segments.map((num) => {
                        const isPaid = num <= paidInstallments;
                        const isCurrent = num === currentInstallment;

                        return (
                            <div
                                key={num}
                                className="flex flex-col items-center gap-2 flex-1"
                            >
                                {/* Circle */}
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                        ${isPaid
                                            ? 'bg-accent-green text-dark-bg'
                                            : isCurrent
                                                ? 'bg-amber-500 text-dark-bg animate-pulse'
                                                : 'bg-white/10 text-white/30'
                                        }
                                    `}
                                >
                                    {isPaid ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Circle className="w-3 h-3" />
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`
                                        text-[10px] font-medium
                                        ${isPaid
                                            ? 'text-accent-green'
                                            : isCurrent
                                                ? 'text-amber-500'
                                                : 'text-white/30'
                                        }
                                    `}
                                >
                                    {num}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Connecting Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10 -z-10" />
            </div>
        </div>
    );
}

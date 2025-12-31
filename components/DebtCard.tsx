"use client";

import { CreditCard, Calendar, TrendingDown } from "lucide-react";
import Link from "next/link";

interface DebtCardProps {
    debt: {
        id: string;
        name: string;
        totalAmount: number;
        totalPaid: number;
        totalRemaining: number;
        currentInstallment: number;
        totalInstallments: number;
        nextDueDate: Date | null;
        progress: number;
    };
}

export default function DebtCard({ debt }: DebtCardProps) {
    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
        });
    };

    return (
        <Link href={`/dividas/${debt.id}`}>
            <div className="bg-dark-card/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-dark-card/40 transition-all cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {debt.name}
                        </h3>
                        <p className="text-sm text-white/50">
                            {debt.currentInstallment}/{debt.totalInstallments} parcelas
                        </p>
                    </div>
                    <div className="p-3 bg-accent-red/10 rounded-xl">
                        <CreditCard className="w-5 h-5 text-accent-red" />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                        <span>Progresso</span>
                        <span>{debt.progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-500"
                            style={{ width: `${debt.progress}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                        <p className="text-xs text-white/40 mb-1">Pago</p>
                        <p className="text-sm font-semibold text-accent-green">
                            {formatCurrency(debt.totalPaid)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/40 mb-1">Restante</p>
                        <p className="text-sm font-semibold text-accent-red">
                            {formatCurrency(debt.totalRemaining)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/40 mb-1">Total</p>
                        <p className="text-sm font-semibold text-white/70">
                            {formatCurrency(debt.totalAmount)}
                        </p>
                    </div>
                </div>

                {/* Next Due Date */}
                {debt.nextDueDate && (
                    <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4" />
                        <span>Próximo vencimento: {formatDate(debt.nextDueDate)}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}

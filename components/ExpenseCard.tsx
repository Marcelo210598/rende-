"use client";

import { motion } from "framer-motion";
import { Trash2, Edit, Check } from "lucide-react";

interface ExpenseCardProps {
    expense: {
        id: string;
        amount: number;
        note?: string | null;
        date: string;
        isPaid?: boolean;
        paidAt?: string | null;
        category: {
            name: string;
            emoji: string;
        };
    };
    isDiscreteMode?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onTogglePaid?: (id: string, isPaid: boolean) => void;
}

export default function ExpenseCard({
    expense,
    isDiscreteMode,
    onEdit,
    onDelete,
    onTogglePaid
}: ExpenseCardProps) {
    const formatCurrency = (value: number) => {
        if (isDiscreteMode) return "R$ ••••";
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Hoje";
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return "Ontem";
        }
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
        });
    };

    const isPaid = expense.isPaid || false;

    const handleTogglePaid = () => {
        if (onTogglePaid) {
            onTogglePaid(expense.id, !isPaid);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`glass-card p-4 flex items-center gap-4 transition-opacity ${
                isPaid ? 'opacity-60' : ''
            }`}
        >
            {/* Checkbox de pago */}
            {onTogglePaid && (
                <button
                    onClick={handleTogglePaid}
                    className="flex-shrink-0 w-6 h-6 rounded-lg border-2 border-white/20 flex items-center justify-center transition-all hover:border-accent-green"
                    style={{
                        backgroundColor: isPaid ? '#10b981' : 'transparent',
                        borderColor: isPaid ? '#10b981' : 'rgba(255, 255, 255, 0.2)'
                    }}
                >
                    {isPaid && <Check size={16} className="text-white" />}
                </button>
            )}

            {/* Category emoji */}
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                {expense.category.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                    isPaid ? 'line-through text-white/50' : ''
                }`}>
                    {expense.note || expense.category.name}
                </p>
                <p className="text-sm text-white/50">
                    {expense.category.name} • {formatDate(expense.date)}
                </p>
                {isPaid && expense.paidAt && (
                    <p className="text-xs text-accent-green mt-1">
                        ✓ Pago em {new Date(expense.paidAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                        })}
                    </p>
                )}
            </div>

            {/* Amount */}
            <div className="text-right">
                <p className={`font-semibold text-accent-red ${
                    isDiscreteMode ? 'discrete-blur' : ''
                } ${
                    isPaid ? 'line-through' : ''
                }`}>
                    -{formatCurrency(expense.amount)}
                </p>
            </div>

            {/* Actions */}
            {(onEdit || onDelete) && (
                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <Edit size={16} className="text-white/60" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
                        >
                            <Trash2 size={16} className="text-white/60" />
                        </button>
                    )}
                </div>
            )}
        </motion.div>
    );
}

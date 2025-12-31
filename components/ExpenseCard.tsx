"use client";

import { motion } from "framer-motion";
import { Trash2, Edit } from "lucide-react";

interface ExpenseCardProps {
    expense: {
        id: string;
        amount: number;
        note?: string | null;
        date: string;
        category: {
            name: string;
            emoji: string;
        };
    };
    isDiscreteMode?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function ExpenseCard({
    expense,
    isDiscreteMode,
    onEdit,
    onDelete
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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="glass-card p-4 flex items-center gap-4"
        >
            {/* Category emoji */}
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                {expense.category.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                    {expense.note || expense.category.name}
                </p>
                <p className="text-sm text-white/50">
                    {expense.category.name} • {formatDate(expense.date)}
                </p>
            </div>

            {/* Amount */}
            <div className="text-right">
                <p className={`font-semibold text-accent-red ${isDiscreteMode ? "discrete-blur" : ""}`}>
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

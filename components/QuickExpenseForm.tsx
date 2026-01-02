"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";

interface QuickExpenseFormProps {
    onSuccess?: () => void;
}

export default function QuickExpenseForm({ onSuccess }: QuickExpenseFormProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Fetch categories on mount
    useState(() => {
        fetchCategories();
    });

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCategory || !amount) {
            toast.error('Selecione categoria e valor');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: selectedCategory,
                    amount: parseFloat(amount),
                    note: note || null,
                }),
            });

            if (!response.ok) throw new Error('Erro ao salvar');

            toast.success('Gasto adicionado! ✅');
            setAmount('');
            setNote('');
            setSelectedCategory('');

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao adicionar gasto');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input - Large and Prominent */}
            <div>
                <label className="text-sm text-white/50 mb-2 block">Valor</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-green">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0,00"
                        className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-3xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-accent-green"
                        autoFocus
                    />
                </div>
            </div>

            {/* Category Grid - Touch Friendly */}
            <div>
                <label className="text-sm text-white/50 mb-3 block">Categoria</label>
                {isLoadingCategories ? (
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.id)}
                                className={`
                                    flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all
                                    ${selectedCategory === category.id
                                        ? 'bg-accent-green/20 border-2 border-accent-green scale-105'
                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                    }
                                `}
                            >
                                <span className="text-2xl">{category.emoji}</span>
                                <span className="text-[10px] font-medium text-white/70 text-center leading-tight">
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Note - Optional */}
            <div>
                <label className="text-sm text-white/50 mb-2 block">Descrição (opcional)</label>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ex: Almoço no restaurante..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-accent-green"
                />
            </div>

            {/* Submit Button - Fixed at Bottom */}
            <button
                type="submit"
                disabled={isSaving || !selectedCategory || !amount}
                className="w-full py-4 bg-accent-green text-dark-bg font-bold text-lg rounded-2xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Salvando...' : 'Adicionar Gasto'}
            </button>
        </form>
    );
}

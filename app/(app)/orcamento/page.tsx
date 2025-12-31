"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePrivateMode } from "@/contexts/PrivateModeContext";
import Modal from "@/components/ui/Modal";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface Category {
    id: string;
    name: string;
    emoji: string;
}

interface Budget {
    id: string;
    categoryId: string;
    category: Category;
    monthlyLimit: number;
    spent: number;
    remaining: number;
    percentage: number;
    month: number;
    year: number;
}

export default function OrcamentoPage() {
    const { isPrivateMode } = usePrivateMode();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteBudget, setDeleteBudget] = useState<Budget | null>(null);

    // Form state
    const [selectedCategory, setSelectedCategory] = useState("");
    const [limit, setLimit] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const fetchData = useCallback(async () => {
        try {
            const [budgetsRes, categoriesRes] = await Promise.all([
                fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`),
                fetch("/api/categories"),
            ]);

            if (budgetsRes.ok) setBudgets(await budgetsRes.json());
            if (categoriesRes.ok) setCategories(await categoriesRes.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentMonth, currentYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddBudget = async () => {
        if (!selectedCategory || !limit) {
            toast.error("Selecione uma categoria e defina um limite");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch("/api/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryId: selectedCategory,
                    monthlyLimit: parseFloat(limit),
                    month: currentMonth,
                    year: currentYear,
                }),
            });

            if (!response.ok) throw new Error("Erro ao criar orçamento");

            toast.success("Meta de orçamento criada!");
            setShowAddModal(false);
            setSelectedCategory("");
            setLimit("");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar orçamento");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBudget = async () => {
        if (!deleteBudget) return;

        try {
            const response = await fetch(`/api/budgets/${deleteBudget.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erro ao excluir");

            setBudgets((prev) => prev.filter((b) => b.id !== deleteBudget.id));
            toast.success("Meta excluída!");
            setDeleteBudget(null);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir orçamento");
        }
    };

    const formatCurrency = (value: number) => {
        if (isPrivateMode) return "R$ ••••";
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    // Categories not yet in budget
    const availableCategories = categories.filter(
        (cat) => !budgets.find((b) => b.categoryId === cat.id)
    );

    // Stats
    const totalLimit = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const alertsCount = budgets.filter((b) => b.percentage > 100).length;

    const getMonthName = () => {
        return new Date(currentYear, currentMonth - 1).toLocaleDateString("pt-BR", {
            month: "long",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold">Orçamento</h1>
                    <p className="text-white/50 text-sm capitalize">{getMonthName()} de {currentYear}</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    disabled={availableCategories.length === 0}
                    className="p-3 rounded-xl bg-accent-green/20 text-accent-green hover:bg-accent-green/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={24} />
                </button>
            </motion.div>

            {/* Summary */}
            {budgets.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-4"
                >
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-white/50 mb-1">Limite Total</p>
                            <p className={`font-bold ${isPrivateMode ? "discrete-blur" : ""}`}>
                                {formatCurrency(totalLimit)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-white/50 mb-1">Gasto</p>
                            <p className={`font-bold text-accent-red ${isPrivateMode ? "discrete-blur" : ""}`}>
                                {formatCurrency(totalSpent)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-white/50 mb-1">Alertas</p>
                            <p className={`font-bold ${alertsCount > 0 ? "text-accent-red" : "text-accent-green"}`}>
                                {alertsCount}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Budgets List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                {isLoading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : budgets.length > 0 ? (
                    <AnimatePresence>
                        {budgets.map((budget) => {
                            const isExceeded = budget.percentage > 100;
                            const isWarning = budget.percentage >= 80 && budget.percentage <= 100;

                            return (
                                <motion.div
                                    key={budget.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className={`glass-card p-4 ${isExceeded ? "border border-accent-red/30" : ""
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{budget.category.emoji}</span>
                                            <div>
                                                <p className="font-medium">{budget.category.name}</p>
                                                <p className={`text-sm ${isPrivateMode ? "discrete-blur" : ""}`}>
                                                    <span className={isExceeded ? "text-accent-red" : "text-white/70"}>
                                                        {formatCurrency(budget.spent)}
                                                    </span>
                                                    <span className="text-white/40"> / </span>
                                                    <span className="text-white/50">{formatCurrency(budget.monthlyLimit)}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isExceeded && (
                                                <AlertTriangle size={20} className="text-accent-red" />
                                            )}
                                            <button
                                                onClick={() => setDeleteBudget(budget)}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                <Trash2 size={16} className="text-white/40" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-bar-fill ${isExceeded
                                                    ? "bg-accent-red"
                                                    : isWarning
                                                        ? "bg-accent-orange"
                                                        : "bg-accent-green"
                                                }`}
                                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between mt-2 text-xs">
                                        <span className={`${isExceeded
                                                ? "text-accent-red"
                                                : isWarning
                                                    ? "text-accent-orange"
                                                    : "text-white/50"
                                            }`}>
                                            {Math.round(budget.percentage)}% utilizado
                                        </span>
                                        <span className={`${isPrivateMode ? "discrete-blur" : ""} ${budget.remaining < 0 ? "text-accent-red" : "text-accent-green"
                                            }`}>
                                            {budget.remaining >= 0 ? "Resta: " : "Excedeu: "}
                                            {formatCurrency(Math.abs(budget.remaining))}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                ) : (
                    <div className="glass-card p-8 text-center">
                        <span className="text-4xl mb-3 block">🎯</span>
                        <p className="text-white/50">Nenhuma meta de orçamento</p>
                        <p className="text-sm text-white/30 mt-1">
                            Defina limites de gastos por categoria para controlar melhor suas finanças
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Add Budget Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nova Meta">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Categoria
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {availableCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`p-3 rounded-xl transition-colors text-center ${selectedCategory === cat.id
                                            ? "bg-accent-green/20 ring-2 ring-accent-green"
                                            : "bg-white/5 hover:bg-white/10"
                                        }`}
                                >
                                    <span className="text-2xl block mb-1">{cat.emoji}</span>
                                    <span className="text-xs text-white/70">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                        {availableCategories.length === 0 && (
                            <p className="text-sm text-white/50 text-center py-4">
                                Todas as categorias já têm metas definidas
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Limite mensal (R$)
                        </label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            placeholder="0,00"
                            className="input-field"
                        />
                    </div>

                    <button
                        onClick={handleAddBudget}
                        disabled={isSaving || !selectedCategory || !limit}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {isSaving ? "Salvando..." : "Criar Meta"}
                    </button>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <Modal isOpen={!!deleteBudget} onClose={() => setDeleteBudget(null)} title="Excluir Meta">
                <div className="space-y-4">
                    <p className="text-white/70">
                        Tem certeza que deseja excluir a meta de "{deleteBudget?.category.name}"?
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setDeleteBudget(null)} className="btn-secondary flex-1">
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeleteBudget}
                            className="flex-1 px-6 py-3 rounded-2xl font-semibold text-white bg-accent-red hover:bg-red-600"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

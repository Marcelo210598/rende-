"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { usePrivateMode } from "@/contexts/PrivateModeContext";
import FloatingAddButton from "@/components/FloatingAddButton";
import DonutChart from "@/components/charts/DonutChart";
import ExpenseCard from "@/components/ExpenseCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

interface Stats {
    monthlyIncome: number;
    totalExpenses: number;
    balance: number;
    categoriesWithSpending: Array<{
        category: { id: string; name: string; emoji: string };
        amount: number;
    }>;
    recentExpenses: Array<{
        id: string;
        amount: number;
        note: string | null;
        date: string;
        category: { name: string; emoji: string };
    }>;
    budgetAlerts: Array<{
        category: { name: string; emoji: string };
        limit: number;
        spent: number;
        exceeded: number;
    }>;
    month: number;
    year: number;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const { isPrivateMode, togglePrivateMode } = usePrivateMode();
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch("/api/stats");
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchStats();
    };

    const formatCurrency = (value: number) => {
        if (isPrivateMode) return "R$ ••••,••";
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const getFirstName = () => {
        const name = session?.user?.name || "Usuário";
        return name.split(" ")[0];
    };

    const getMonthName = () => {
        if (!stats) return "";
        return new Date(stats.year, stats.month - 1).toLocaleDateString("pt-BR", {
            month: "long",
        });
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    const balanceColor = (stats?.balance ?? 0) >= 0 ? "text-accent-green" : "text-accent-red";

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold">
                        Olá, {getFirstName()}! 👋
                    </h1>
                    <p className="text-white/50 text-sm capitalize">
                        {getMonthName()} de {stats?.year}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            size={20}
                            className={`text-white/60 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                    </button>
                    <button
                        onClick={togglePrivateMode}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        {isPrivateMode ? (
                            <EyeOff size={20} className="text-white/60" />
                        ) : (
                            <Eye size={20} className="text-white/60" />
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-white/50 text-sm">Resumo do mês</span>
                    {stats?.budgetAlerts && stats.budgetAlerts.length > 0 && (
                        <span className="text-xs bg-accent-red/20 text-accent-red px-2 py-1 rounded-full">
                            ⚠️ {stats.budgetAlerts.length} alerta{stats.budgetAlerts.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-white/50 mb-1">Renda</p>
                        <p className={`text-lg font-bold text-accent-green ${isPrivateMode ? "discrete-blur" : ""}`}>
                            {formatCurrency(stats?.monthlyIncome || 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/50 mb-1">Gastos</p>
                        <p className={`text-lg font-bold text-accent-red ${isPrivateMode ? "discrete-blur" : ""}`}>
                            {formatCurrency(stats?.totalExpenses || 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/50 mb-1">Saldo</p>
                        <p className={`text-lg font-bold ${balanceColor} ${isPrivateMode ? "discrete-blur" : ""}`}>
                            {formatCurrency(stats?.balance || 0)}
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                    <div className="progress-bar">
                        <div
                            className={`progress-bar-fill ${(stats?.totalExpenses || 0) > (stats?.monthlyIncome || 0)
                                    ? "bg-accent-red"
                                    : "bg-accent-green"
                                }`}
                            style={{
                                width: `${Math.min(
                                    ((stats?.totalExpenses || 0) / (stats?.monthlyIncome || 1)) * 100,
                                    100
                                )}%`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-white/40 mt-1 text-right">
                        {stats?.monthlyIncome
                            ? Math.round(((stats?.totalExpenses || 0) / stats.monthlyIncome) * 100)
                            : 0}
                        % da renda utilizada
                    </p>
                </div>
            </motion.div>

            {/* Budget Alerts */}
            <AnimatePresence>
                {stats?.budgetAlerts && stats.budgetAlerts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        {stats.budgetAlerts.map((alert, index) => (
                            <div
                                key={index}
                                className="glass-card p-4 border border-accent-red/30 bg-accent-red/5"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{alert.category.emoji}</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            {alert.category.name} excedeu o limite!
                                        </p>
                                        <p className="text-xs text-white/50">
                                            Limite: {formatCurrency(alert.limit)} • Gasto:{" "}
                                            {formatCurrency(alert.spent)}
                                        </p>
                                    </div>
                                    <span className="text-accent-red font-semibold text-sm">
                                        +{formatCurrency(alert.exceeded)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Donut Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
            >
                <h2 className="text-lg font-semibold mb-4">Gastos por Categoria</h2>
                <DonutChart
                    data={stats?.categoriesWithSpending || []}
                    totalAmount={stats?.totalExpenses || 0}
                    isDiscreteMode={isPrivateMode}
                />
            </motion.div>

            {/* Recent Expenses */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Últimos Gastos</h2>
                    <a href="/gastos" className="text-sm text-accent-green hover:underline">
                        Ver todos
                    </a>
                </div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {stats?.recentExpenses && stats.recentExpenses.length > 0 ? (
                            stats.recentExpenses.map((expense) => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    isDiscreteMode={isPrivateMode}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card p-8 text-center"
                            >
                                <span className="text-4xl mb-3 block">📝</span>
                                <p className="text-white/50">Nenhum gasto registrado</p>
                                <p className="text-sm text-white/30 mt-1">
                                    Toque no + para adicionar seu primeiro gasto
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Floating Add Button */}
            <FloatingAddButton href="/adicionar-gasto" />
        </div>
    );
}

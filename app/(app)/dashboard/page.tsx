"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Calendar,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import FinancialSummaryCards from "@/components/dashboard/FinancialSummaryCards";
import EvolutionLineChart from "@/components/dashboard/EvolutionLineChart";
import FloatingAddButton from "@/components/FloatingAddButton";
import MonthSelector from "@/components/MonthSelector";
import DonutChart from "@/components/charts/DonutChart";
import ExpenseCard from "@/components/ExpenseCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

interface MonthlyStats {
  month: number;
  year: number;
  summary: {
    income: number;
    expenses: number;
    balance: number;
    savings: number;
  };
  totalExpenses: number;
  byCategory: Array<{
    categoryId: string;
    category: { id: string; name: string; emoji: string };
    amount: number;
    count: number;
  }>;
  evolution: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
  comparison: {
    previousMonth: number;
    percentageChange: number;
    trend: "up" | "down" | "stable";
  };
  dailyAverage: number;
  expenseCount: number;
}

interface DebtsSummary {
  totals: {
    activeDebts: number;
    totalRemaining: number;
    totalPaid: number;
  };
}

interface InstallmentsSummary {
  summary: {
    total: number;
    totalAmount: number;
    pending: number;
    pendingAmount: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [debtsSummary, setDebtsSummary] = useState<DebtsSummary | null>(null);
  const [installmentsSummary, setInstallmentsSummary] =
    useState<InstallmentsSummary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Fetch monthly stats
      const statsRes = await fetch(
        `/api/stats/monthly?month=${month}&year=${year}`,
      );
      if (statsRes.ok) {
        const data = await statsRes.json();
        setMonthlyStats(data);
      }

      // Fetch debts summary
      const debtsRes = await fetch("/api/debts/summary");
      if (debtsRes.ok) {
        setDebtsSummary(await debtsRes.json());
      }

      // Fetch monthly installments
      const installmentsRes = await fetch(
        `/api/installments/monthly?month=${month}&year=${year}`,
      );
      if (installmentsRes.ok) {
        setInstallmentsSummary(await installmentsRes.json());
      }

      // Fetch recent expenses
      const expensesRes = await fetch(
        `/api/expenses?month=${month}&year=${year}&limit=5`,
      );
      if (expensesRes.ok) {
        setRecentExpenses(await expensesRes.json());
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const getFirstName = () => {
    const name = session?.user?.name || "Usuário";
    return name.split(" ")[0];
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Olá, {getFirstName()}! 👋</h1>
          <p className="text-muted-foreground text-sm">Dashboard Financeiro</p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw
              size={20}
              className={`text-foreground ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </motion.div>

      {/* Month Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MonthSelector month={month} year={year} onChange={handleMonthChange} />
      </motion.div>

      {/* Financial Summary Cards */}
      {monthlyStats?.summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FinancialSummaryCards data={monthlyStats.summary} />
        </motion.div>
      )}

      {/* Evolution Chart */}
      {monthlyStats?.evolution && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-2">
            Evolução Financeira (6 meses)
          </h2>
          <EvolutionLineChart data={monthlyStats.evolution} />
        </motion.div>
      )}

      {/* Donut Chart */}
      {monthlyStats && monthlyStats.byCategory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Gastos por Categoria</h2>
          <DonutChart
            data={monthlyStats.byCategory.map((item) => ({
              category: item.category,
              amount: item.amount,
            }))}
            totalAmount={monthlyStats.totalExpenses}
            isDiscreteMode={false}
          />
        </motion.div>
      )}

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Últimos Gastos</h2>
          <a
            href="/gastos"
            className="text-sm text-accent-green hover:underline"
          >
            Ver todos
          </a>
        </div>

        <div className="space-y-3">
          {recentExpenses && recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                isDiscreteMode={false}
              />
            ))
          ) : (
            <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-8 text-center">
              <span className="text-4xl mb-3 block">📝</span>
              <p className="text-muted-foreground">Nenhum gasto registrado</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Toque no + para adicionar seu primeiro gasto
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Add Button */}
      <FloatingAddButton href="/adicionar-gasto" />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Target, Lightbulb, ChevronRight } from "lucide-react";

interface Insight {
  id: string;
  type: "warning" | "success" | "tip" | "alert";
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

interface InsightsCardProps {
  monthlyStats?: {
    summary?: {
      income: number;
      expenses: number;
      balance: number;
    };
    comparison?: {
      previousMonth: number;
      percentageChange: number;
      trend: "up" | "down" | "stable";
    };
    byCategory?: Array<{
      category: { name: string };
      amount: number;
    }>;
  };
  budgets?: Array<{
    category: { name: string };
    percentage: number;
    remaining: number;
  }>;
  goals?: Array<{
    title: string;
    currentAmount: number;
    targetAmount: number;
    isCompleted: boolean;
  }>;
}

export default function InsightsCard({ monthlyStats, budgets, goals }: InsightsCardProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const generatedInsights: Insight[] = [];

    // Analyze spending trend
    if (monthlyStats?.comparison) {
      const { percentageChange, trend } = monthlyStats.comparison;
      
      if (trend === "up" && percentageChange > 20) {
        generatedInsights.push({
          id: "spending-up",
          type: "warning",
          icon: <TrendingUp className="text-orange-400" size={20} />,
          title: "Gastos em alta",
          description: `Seus gastos aumentaram ${Math.round(percentageChange)}% em relação ao mês passado. Revise suas despesas.`,
          action: { label: "Ver gastos", href: "/gastos" },
        });
      } else if (trend === "down" && percentageChange < -10) {
        generatedInsights.push({
          id: "spending-down",
          type: "success",
          icon: <TrendingDown className="text-emerald-400" size={20} />,
          title: "Parabéns! 🎉",
          description: `Você reduziu seus gastos em ${Math.abs(Math.round(percentageChange))}% este mês. Continue assim!`,
        });
      }
    }

    // Check budget alerts
    if (budgets && budgets.length > 0) {
      const exceededBudgets = budgets.filter((b) => b.percentage > 100);
      const nearLimitBudgets = budgets.filter((b) => b.percentage >= 80 && b.percentage <= 100);

      if (exceededBudgets.length > 0) {
        generatedInsights.push({
          id: "budget-exceeded",
          type: "alert",
          icon: <AlertTriangle className="text-red-400" size={20} />,
          title: "Orçamento estourado",
          description: `Você ultrapassou o limite em ${exceededBudgets.map((b) => b.category.name).join(", ")}.`,
          action: { label: "Ver orçamento", href: "/orcamento" },
        });
      } else if (nearLimitBudgets.length > 0) {
        generatedInsights.push({
          id: "budget-warning",
          type: "warning",
          icon: <AlertTriangle className="text-yellow-400" size={20} />,
          title: "Atenção ao orçamento",
          description: `${nearLimitBudgets[0].category.name} está com ${Math.round(nearLimitBudgets[0].percentage)}% do limite usado.`,
          action: { label: "Ver orçamento", href: "/orcamento" },
        });
      }
    }

    // Check goals progress
    if (goals && goals.length > 0) {
      const activeGoals = goals.filter((g) => !g.isCompleted);
      const completedRecently = goals.filter((g) => g.isCompleted);

      if (completedRecently.length > 0) {
        generatedInsights.push({
          id: "goal-completed",
          type: "success",
          icon: <Target className="text-emerald-400" size={20} />,
          title: "Meta atingida! 🎯",
          description: `Você completou a meta "${completedRecently[0].title}". Que tal definir uma nova?`,
          action: { label: "Ver metas", href: "/metas" },
        });
      } else if (activeGoals.length > 0) {
        const nearestGoal = activeGoals.reduce((prev, curr) => {
          const prevProgress = prev.currentAmount / prev.targetAmount;
          const currProgress = curr.currentAmount / curr.targetAmount;
          return currProgress > prevProgress ? curr : prev;
        });
        
        const progress = Math.round((nearestGoal.currentAmount / nearestGoal.targetAmount) * 100);
        
        if (progress >= 80) {
          generatedInsights.push({
            id: "goal-near",
            type: "tip",
            icon: <Sparkles className="text-purple-400" size={20} />,
            title: "Quase lá!",
            description: `Sua meta "${nearestGoal.title}" está em ${progress}%. Mais um pouco!`,
            action: { label: "Depositar", href: "/metas" },
          });
        }
      }
    }

    // Analyze top category
    if (monthlyStats?.byCategory && monthlyStats.byCategory.length > 0) {
      const topCategory = monthlyStats.byCategory[0];
      const total = monthlyStats.summary?.expenses || 0;
      const percentage = total > 0 ? Math.round((topCategory.amount / total) * 100) : 0;

      if (percentage > 40) {
        generatedInsights.push({
          id: "top-category",
          type: "tip",
          icon: <Lightbulb className="text-blue-400" size={20} />,
          title: "Dica de economia",
          description: `${topCategory.category.name} representa ${percentage}% dos seus gastos. Considere definir um limite.`,
          action: { label: "Criar limite", href: "/orcamento" },
        });
      }
    }

    // Default insight if no specific ones
    if (generatedInsights.length === 0) {
      generatedInsights.push({
        id: "default",
        type: "tip",
        icon: <Sparkles className="text-emerald-400" size={20} />,
        title: "Continue assim!",
        description: "Suas finanças estão em dia. Que tal definir uma nova meta de economia?",
        action: { label: "Criar meta", href: "/metas" },
      });
    }

    setInsights(generatedInsights);
  }, [monthlyStats, budgets, goals]);

  // Auto-rotate insights
  useEffect(() => {
    if (insights.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [insights.length]);

  if (insights.length === 0) return null;

  const currentInsight = insights[currentIndex];

  const bgColors = {
    warning: "bg-orange-500/10 border-orange-500/20",
    success: "bg-emerald-500/10 border-emerald-500/20",
    tip: "bg-blue-500/10 border-blue-500/20",
    alert: "bg-red-500/10 border-red-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${bgColors[currentInsight.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white/5">
          {currentInsight.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-sm">
              {currentInsight.title}
            </h3>
            {insights.length > 1 && (
              <span className="text-xs text-white/40">
                {currentIndex + 1}/{insights.length}
              </span>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={currentInsight.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-sm text-white/60"
            >
              {currentInsight.description}
            </motion.p>
          </AnimatePresence>

          {currentInsight.action && (
            <a
              href={currentInsight.action.href}
              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {currentInsight.action.label}
              <ChevronRight size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Dots indicator */}
      {insights.length > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {insights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === currentIndex ? "bg-white/60" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

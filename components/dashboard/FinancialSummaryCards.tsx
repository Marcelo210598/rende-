"use client";

import { ArrowDown, ArrowUp, DollarSign, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryData {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
}

interface FinancialSummaryCardsProps {
  data: SummaryData;
  isLoading?: boolean;
}

export default function FinancialSummaryCards({
  data,
  isLoading,
}: FinancialSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const cards = [
    {
      title: "Saldo Atual",
      value: data.balance,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      isPositive: data.balance >= 0,
    },
    {
      title: "Receitas",
      value: data.income,
      icon: ArrowUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      isPositive: true,
    },
    {
      title: "Despesas",
      value: data.expenses,
      icon: ArrowDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
      isPositive: false,
    },
    {
      title: "Economia",
      value: data.savings,
      icon: DollarSign,
      color: data.savings >= 0 ? "text-emerald-500" : "text-amber-500",
      bg: data.savings >= 0 ? "bg-emerald-500/10" : "bg-amber-500/10",
      isPositive: data.savings >= 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-card/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-2xl bg-card border border-border flex flex-col justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground">{card.title}</span>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <div>
            <h3
              className={`text-lg sm:text-2xl font-bold ${
                card.title === "Despesas"
                  ? "text-red-500 dark:text-red-400"
                  : card.title === "Receitas"
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-foreground"
              }`}
            >
              {formatCurrency(card.value)}
            </h3>
            {card.title === "Economia" && (
              <span className="text-xs text-muted-foreground">
                {data.income > 0
                  ? `${Math.round((data.savings / data.income) * 100)}% da receita`
                  : "0%"}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

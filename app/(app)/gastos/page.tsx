"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePrivateMode } from "@/contexts/PrivateModeContext";
import ExpenseCard from "@/components/ExpenseCard";
import FloatingAddButton from "@/components/FloatingAddButton";
import Modal from "@/components/ui/Modal";
import { ExpenseItemSkeleton } from "@/components/ui/Skeleton";
import EditExpenseModal from "@/components/EditExpenseModal";

interface Category {
  id: string;
  name: string;
  emoji: string;
  isDefault: boolean;
}

interface Expense {
  id: string;
  amount: number;
  note: string | null;
  date: string;
  isPaid?: boolean;
  paidAt?: string | null;
  dueDate?: string | null;
  enableNotification?: boolean;
  category: Category;
}

export default function GastosPage() {
  const { isPrivateMode } = usePrivateMode();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/categories"),
      ]);

      if (expensesRes.ok) setExpenses(await expensesRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteExpense) return;

    try {
      const response = await fetch(`/api/expenses/${deleteExpense.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir");

      setExpenses((prev) => prev.filter((e) => e.id !== deleteExpense.id));
      toast.success("Gasto excluído!");
      setDeleteExpense(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir gasto");
    }
  };

  const handleTogglePaid = async (expenseId: string, isPaid: boolean) => {
    try {
      // Optimistic update
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === expenseId
            ? { ...e, isPaid, paidAt: isPaid ? new Date().toISOString() : null }
            : e,
        ),
      );

      const response = await fetch(`/api/expenses/${expenseId}/toggle-paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      const { expense } = await response.json();

      // Update with server response
      setExpenses((prev) =>
        prev.map((e) => (e.id === expenseId ? expense : e)),
      );

      toast.success(isPaid ? "Gasto marcado como pago!" : "Gasto desmarcado");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status");
      // Revert optimistic update
      await fetchData();
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      !searchQuery ||
      expense.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || expense.category.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group by date
  const groupedExpenses = filteredExpenses.reduce(
    (groups, expense) => {
      const date = new Date(expense.date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(expense);
      return groups;
    },
    {} as Record<string, Expense[]>,
  );

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Meus Gastos</h1>
        <p className="text-white/50 text-sm">
          {filteredExpenses.length} gastos • Total:{" "}
          <span className={isPrivateMode ? "discrete-blur" : ""}>
            {totalFiltered.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {/* Search bar */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar gastos..."
            className="input-field pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            selectedCategory
              ? "bg-accent-green/20 text-accent-green"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <Filter size={16} />
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : "Filtrar categoria"}
        </button>

        {/* Category filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setShowFilters(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-accent-green text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-accent-green text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {category.emoji} {category.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expenses List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <ExpenseItemSkeleton key={i} />
            ))}
          </div>
        ) : Object.keys(groupedExpenses).length > 0 ? (
          Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
            <div key={date}>
              <h3 className="text-sm text-white/50 mb-3 capitalize">{date}</h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {dayExpenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      isDiscreteMode={isPrivateMode}
                      onDelete={() => setDeleteExpense(expense)}
                      onTogglePaid={handleTogglePaid}
                      onEdit={() => setEditingExpense(expense)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 text-center">
            <span className="text-4xl mb-3 block">
              {searchQuery || selectedCategory ? "🔍" : "📝"}
            </span>
            <p className="text-white/50">
              {searchQuery || selectedCategory
                ? "Nenhum gasto encontrado"
                : "Nenhum gasto registrado"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Floating Add Button */}
      <FloatingAddButton href="/adicionar-gasto" />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteExpense}
        onClose={() => setDeleteExpense(null)}
        title="Excluir Gasto"
      >
        <div className="space-y-4">
          <p className="text-white/70">
            Tem certeza que deseja excluir este gasto?
          </p>
          {deleteExpense && (
            <div className="glass-card p-4 flex items-center gap-4">
              <span className="text-2xl">{deleteExpense.category.emoji}</span>
              <div className="flex-1">
                <p className="font-medium">
                  {deleteExpense.note || deleteExpense.category.name}
                </p>
                <p className="text-sm text-accent-red">
                  {deleteExpense.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteExpense(null)}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-3 rounded-2xl font-semibold text-white transition-all bg-accent-red hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Excluir
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Expense Modal */}
      <EditExpenseModal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        expense={editingExpense}
        onUpdate={fetchData}
      />
    </div>
  );
}

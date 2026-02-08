"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Calendar, Bell, StickyNote } from "lucide-react";
import { toast } from "sonner";
import CategoryGrid from "@/components/CategoryGrid";

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
  dueDate?: string | null;
  enableNotification?: boolean;
  category: Category;
}

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onUpdate: () => void;
}

export default function EditExpenseModal({
  isOpen,
  onClose,
  expense,
  onUpdate,
}: EditExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Alert state
  const [dueDate, setDueDate] = useState("");
  const [enableNotification, setEnableNotification] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then(setCategories)
        .catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setSelectedCategory(expense.category.id);
      setNote(expense.note || "");
      setDueDate(
        expense.dueDate
          ? new Date(expense.dueDate).toISOString().split("T")[0]
          : "",
      );
      setEnableNotification(expense.enableNotification || false);
    }
  }, [expense]);

  const handleSave = async () => {
    if (!expense) return;

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Valor inválido");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          categoryId: selectedCategory,
          note: note || null,
          dueDate:
            enableNotification && dueDate
              ? new Date(dueDate).toISOString()
              : null,
          enableNotification,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      toast.success("Gasto atualizado!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar gasto");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="relative w-full max-w-lg bg-[#1a1b1e] border border-white/10 rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Editar Gasto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Amount */}
          <div>
            <label className="text-sm text-white/50 block mb-2">Valor</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field text-2xl font-bold text-accent-red w-full"
              placeholder="0,00"
            />
          </div>

          {/* Note & Alert Config */}
          <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
            {/* Note */}
            <div>
              <label className="text-sm text-white/50 block mb-2 flex items-center gap-2">
                <StickyNote size={14} /> Nota
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-field text-sm"
                placeholder="Descrição opcional"
              />
            </div>

            {/* Notification Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Bell
                  size={16}
                  className={
                    enableNotification ? "text-accent-blue" : "text-white/50"
                  }
                />
                <span className="text-sm">Alertar no vencimento?</span>
              </div>
              <div
                onClick={() => setEnableNotification(!enableNotification)}
                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${enableNotification ? "bg-accent-green" : "bg-white/20"}`}
              >
                <motion.div
                  layout
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: enableNotification ? 20 : 0 }}
                />
              </div>
            </div>

            {/* Date Picker (Conditional) */}
            <AnimatePresence>
              {enableNotification && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-xs text-white/50 block mb-1 mt-2">
                    Data de Vencimento
                  </label>
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                    />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="input-field pl-10 h-10 text-sm w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Categories */}
          <div>
            <label className="text-sm text-white/50 block mb-2">
              Categoria
            </label>
            <div className="h-60 overflow-y-auto pr-2">
              <CategoryGrid
                categories={categories}
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
                onAddCategory={() => {}}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check size={20} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

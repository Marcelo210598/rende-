"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, StickyNote, Calendar, Bell } from "lucide-react";
import { toast } from "sonner";
import CategoryGrid from "@/components/CategoryGrid";
import AddCategoryModal from "@/components/AddCategoryModal";

interface Category {
  id: string;
  name: string;
  emoji: string;
  isDefault: boolean;
}

export default function AdicionarGastoPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);

  // New state for alerts
  const [dueDate, setDueDate] = useState("");
  const [enableNotification, setEnableNotification] = useState(false);
  const [showAlertOptions, setShowAlertOptions] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleNumberPress = (num: string) => {
    if (num === "backspace") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (num === ".") {
      if (!amount.includes(".")) {
        setAmount((prev) => prev + ".");
      }
    } else {
      setAmount((prev) => (prev === "0" ? num : prev + num));
    }
  };

  const formatDisplayAmount = () => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleSave = async () => {
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (!selectedCategory) {
      toast.error("Selecione uma categoria");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          categoryId: selectedCategory,
          note: note || null,
          date: new Date().toISOString(),
          dueDate:
            enableNotification && dueDate
              ? new Date(dueDate).toISOString()
              : null,
          enableNotification,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar gasto");

      toast.success("Gasto adicionado! 💰");
      if (enableNotification) {
        toast.success("Alerta de vencimento definido! ⏰");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar gasto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryAdd = (newCategory: { name: string; emoji: string }) => {
    fetchCategories();
    setSelectedCategory(
      categories.find((c) => c.name === newCategory.name)?.id || "",
    );
  };

  const numpadButtons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "backspace",
  ];

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 safe-top flex-none z-10"
      >
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Adicionar Gasto</h1>
        <span className="text-sm text-white/50">
          {new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </motion.div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Amount Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-8 shrink-0"
        >
          <p className="text-sm text-white/50 mb-2">Valor do gasto</p>
          <p className="amount-display text-accent-red">
            {formatDisplayAmount()}
          </p>

          {/* Actions: Note & Alert */}
          <div className="flex gap-4 mt-4">
            {/* Note Toggle */}
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className={`flex items-center gap-2 text-sm transition-colors ${showNoteInput ? "text-white" : "text-white/50 hover:text-white/70"}`}
            >
              <StickyNote size={16} />
              {showNoteInput ? "Ocultar nota" : "Adicionar nota"}
            </button>

            {/* Alert Toggle */}
            <button
              onClick={() => setShowAlertOptions(!showAlertOptions)}
              className={`flex items-center gap-2 text-sm transition-colors ${showAlertOptions ? "text-accent-blue" : "text-white/50 hover:text-white/70"}`}
            >
              <Bell size={16} />
              {showAlertOptions ? "Ocultar alerta" : "Criar alerta"}
            </button>
          </div>

          {/* Note Input */}
          <AnimatePresence>
            {showNoteInput && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="w-full max-w-xs overflow-hidden"
              >
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Descrição opcional..."
                  className="input-field text-center"
                  maxLength={50}
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alert Options */}
          <AnimatePresence>
            {showAlertOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="w-full max-w-xs overflow-hidden space-y-3 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Alertar no vencimento?
                  </span>
                  <div
                    onClick={() => setEnableNotification(!enableNotification)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${enableNotification ? "bg-accent-green" : "bg-white/20"}`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ x: enableNotification ? 24 : 0 }}
                    />
                  </div>
                </div>

                {enableNotification && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1"
                  >
                    <label className="text-xs text-white/50 block">
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
                        className="input-field pl-10 h-10 text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 px-4 pb-4"
        >
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="text-sm text-white/50">Categoria</p>
            <button
              onClick={() => setShowAddCategory(true)}
              className="text-xs text-accent-green hover:underline"
            >
              Nova Categoria
            </button>
          </div>

          <CategoryGrid
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
            onAddCategory={() => setShowAddCategory(true)}
          />

          {/* Add padding at bottom to avoid content being hidden behind gradient or safe area */}
          <div className="h-4" />
        </motion.div>
      </div>

      {/* Numpad - Fixed at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-black/20 backdrop-blur-lg safe-bottom flex-none border-t border-white/5"
      >
        <div className="grid grid-cols-3 gap-3 mb-4">
          {numpadButtons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleNumberPress(btn)}
              className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors text-xl font-medium"
            >
              {btn === "backspace" ? "⌫" : btn}
            </button>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading || !selectedCategory || parseFloat(amount) <= 0}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check size={20} />
              Salvar Gasto
            </>
          )}
        </button>
      </motion.div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSave={handleCategoryAdd}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_CATEGORIES = [
  { id: "alimentacao", name: "Alimentação", emoji: "🍔" },
  { id: "transporte", name: "Transporte", emoji: "🚗" },
  { id: "moradia", name: "Casa", emoji: "🏠" },
  { id: "lazer", name: "Lazer", emoji: "🎮" },
  { id: "saude", name: "Saúde", emoji: "💊" },
  { id: "educacao", name: "Educação", emoji: "📚" },
  { id: "compras", name: "Compras", emoji: "🛒" },
];

export default function QuickAddModal({ isOpen, onClose, onSuccess }: QuickAddModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          // Add default categories
          const allCategories = [...DEFAULT_CATEGORIES, ...data];
          setCategories(allCategories);
          
          // Auto-select last used category
          const lastCategory = localStorage.getItem("lastCategory");
          if (lastCategory) {
            setSelectedCategory(lastCategory);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(DEFAULT_CATEGORIES);
      }
    };

    if (isOpen) {
      fetchCategories();
      // Reset form
      setAmount("");
      setNote("");
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!selectedCategory || !amount) {
      toast.error("Selecione uma categoria e insira o valor");
      return;
    }

    setIsSaving(true);
    try {
      const amountValue = parseFloat(amount);
      if (amountValue <= 0) {
        toast.error("Valor deve ser maior que zero");
        return;
      }

      // Find or create category ID
      const category = categories.find((c) => c.name === selectedCategory);
      const categoryId = category?.id || "default";

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          amount: amountValue,
          note: note || undefined,
          date: new Date(date).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar gasto");
      }

      // Save last used category
      localStorage.setItem("lastCategory", selectedCategory);

      toast.success("Gasto adicionado! 💰");
      
      // Reset form
      setAmount("");
      setNote("");
      
      // Close after short delay to show success
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar gasto");
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryEmoji = (name: string) => {
    return categories.find((c) => c.name === name)?.emoji || "💰";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Gasto Rápido">
      <div className="space-y-5">
        {/* Category Selection */}
        <div>
          <button
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            className={'w-full p-4 rounded-xl transition-all duration-200 text-left flex items-center gap-3 ${
              selectedCategory
                ? "bg-emerald-500/20 border-2 border-emerald-500"
                : "bg-white/5 hover:bg-white/10 border border-white/10"
            }'}
          >
            <span className="text-2xl">{getCategoryEmoji(selectedCategory || "Categoria")}</span>
            <span className="flex-1 font-medium text-white">
              {selectedCategory || "Selecione a categoria"}
            </span>
            <Search size={18} className="text-white/40" />
          </button>

          {/* Category Picker */}
          <AnimatePresence>
            {showCategoryPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-4 gap-2 mt-2"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setShowCategoryPicker(false);
                    }}
                    className={'p-3 rounded-xl transition-all duration-150 text-center ${
                      selectedCategory === cat.name
                        ? "bg-emerald-500 ring-2 ring-emerald-500 scale-105"
                        : "bg-white/5 hover:bg-white/10"
                    }'}
                  >
                    <span className="text-2xl block mb-1">{cat.emoji}</span>
                    <span className="text-xs text-white/70">{cat.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Data
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field pr-10"
            />
            <Calendar 
              size={18} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Valor (R$)
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="input-field text-4xl font-bold text-center py-6"
            autoFocus={!selectedCategory}
          />
        </div>

        {/* Note Input (Optional) */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Nota (opcional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: Almoço no trabalho"
            className="input-field"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || !selectedCategory || !amount}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={20} />
              Adicionar Gasto
            </div>
          )}
        </button>
      </div>
    </Modal>
  );
}

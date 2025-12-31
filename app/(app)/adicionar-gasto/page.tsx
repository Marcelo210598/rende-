"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, StickyNote } from "lucide-react";
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
                }),
            });

            if (!response.ok) throw new Error("Erro ao salvar gasto");

            toast.success("Gasto adicionado! 💰");
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
        setSelectedCategory((categories.find(c => c.name === newCategory.name)?.id) || "");
    };

    const numpadButtons = [
        "1", "2", "3",
        "4", "5", "6",
        "7", "8", "9",
        ".", "0", "backspace",
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 safe-top"
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

            {/* Amount Display */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center px-6"
            >
                <p className="text-sm text-white/50 mb-2">Valor do gasto</p>
                <p className="amount-display text-accent-red">
                    {formatDisplayAmount()}
                </p>

                {/* Note toggle */}
                {showNoteInput ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="w-full max-w-xs mt-4"
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
                ) : (
                    <button
                        onClick={() => setShowNoteInput(true)}
                        className="mt-4 flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors"
                    >
                        <StickyNote size={16} />
                        Adicionar nota
                    </button>
                )}
            </motion.div>

            {/* Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="px-4 py-4"
            >
                <p className="text-sm text-white/50 mb-3">Categoria</p>
                <CategoryGrid
                    categories={categories}
                    selectedId={selectedCategory}
                    onSelect={setSelectedCategory}
                    onAddCategory={() => setShowAddCategory(true)}
                />
            </motion.div>

            {/* Numpad */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-black/20 backdrop-blur-lg safe-bottom"
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

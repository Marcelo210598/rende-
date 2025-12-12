"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Building2, Bitcoin, DollarSign, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

const assetTypes = [
    { id: "acao", label: "Ações", icon: TrendingUp, color: "from-primary to-primary-light" },
    { id: "fii", label: "FIIs", icon: Building2, color: "from-primary-light to-primary" },
    { id: "cripto", label: "Cripto", icon: Bitcoin, color: "from-accent-red to-primary" },
    { id: "renda_fixa", label: "Renda Fixa", icon: DollarSign, color: "from-primary to-accent-red" },
];

export default function AdicionarAtivoPage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        ticker: "",
        name: "",
        quantity: "",
        avgPrice: "",
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedType) {
            setToast({ message: "Selecione um tipo de ativo", type: "error" });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/assets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticker: formData.ticker,
                    name: formData.name || formData.ticker,
                    quantity: parseFloat(formData.quantity),
                    averagePrice: parseFloat(formData.avgPrice),
                    type: selectedType
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar ativo');
            }

            setShowSuccess(true);
            setToast({ message: "Ativo adicionado com sucesso!", type: "success" });

            setTimeout(() => {
                router.push("/carteira");
            }, 2000);
        } catch (error) {
            console.error('Error adding asset:', error);
            setToast({ message: "Erro ao adicionar ativo. Tente novamente.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="p-6 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Adicionar Ativo</h1>
                    <p className="text-gray-400 text-sm">Expanda sua carteira</p>
                </div>
            </div>

            <div className="px-6 space-y-6">
                {/* Asset Type Selection */}
                <div className="space-y-3">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">
                        Tipo de Ativo
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {assetTypes.map((type, index) => {
                            const Icon = type.icon;
                            const isSelected = selectedType === type.id;

                            return (
                                <motion.button
                                    key={type.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedType(type.id)}
                                    className="relative"
                                >
                                    <GlassCard
                                        className={`text-center space-y-3 transition-all ${isSelected
                                                ? "bg-gradient-to-br " + type.color + " border-2 border-primary"
                                                : "hover:bg-white/10"
                                            }`}
                                    >
                                        <div
                                            className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="font-bold">{type.label}</p>
                                    </GlassCard>
                                    {isSelected && (
                                        <motion.div
                                            layoutId="selectedAsset"
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                    {selectedType && (
                        <motion.div
                            key={selectedType}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h3 className="font-bold text-lg mb-4">Detalhes do Ativo</h3>

                                    {/* Ticker */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-300">
                                            {selectedType === "cripto" ? "Moeda" : "Ticker"} *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.ticker}
                                            onChange={(e) => handleInputChange("ticker", e.target.value.toUpperCase())}
                                            placeholder={selectedType === "cripto" ? "BTC, ETH..." : "PETR4, VALE3..."}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Nome (opcional) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-300">
                                            Nome (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Ex: Petrobras PN"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>

                                    {/* Quantidade */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-300">
                                            Quantidade *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.quantity}
                                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                                            placeholder="100"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Preço Médio */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-300">
                                            Preço Médio (R$) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.avgPrice}
                                            onChange={(e) => handleInputChange("avgPrice", e.target.value)}
                                            placeholder="28.50"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Summary Card */}
                                    {formData.quantity && formData.avgPrice && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-gradient-to-br from-primary/20 to-primary-light/20 border border-primary/30 rounded-2xl p-4 space-y-2"
                                        >
                                            <p className="text-sm text-gray-400">Resumo</p>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Total Investido:</span>
                                                <span className="font-bold">
                                                    R$ {(parseFloat(formData.quantity) * parseFloat(formData.avgPrice)).toFixed(2)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Submit Button */}
                                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                                        {isLoading ? (
                                            "Adicionando..."
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 mr-2" />
                                                Adicionar à Carteira
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                        >
                            <GlassCard className="text-center space-y-4 max-w-sm">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                                    <Check className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold">Ativo Adicionado!</h2>
                                <p className="text-gray-400">
                                    Seu ativo foi adicionado com sucesso à carteira.
                                </p>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={!!toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

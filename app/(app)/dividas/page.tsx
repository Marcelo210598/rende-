"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePrivateMode } from "@/contexts/PrivateModeContext";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface DebtInstallment {
    id: string;
    number: number;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    paidAt: string | null;
}

interface Debt {
    id: string;
    name: string;
    totalAmount: number;
    installmentCount: number;
    installmentValue: number;
    firstDueDate: string;
    installments: DebtInstallment[];
}

export default function DividasPage() {
    const { isPrivateMode } = usePrivateMode();
    const [debts, setDebts] = useState<Debt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteDebt, setDeleteDebt] = useState<Debt | null>(null);
    const [expandedDebt, setExpandedDebt] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        totalAmount: "",
        installmentCount: "",
        installmentValue: "",
        firstDueDate: new Date().toISOString().split("T")[0],
    });
    const [isSaving, setIsSaving] = useState(false);

    const fetchDebts = useCallback(async () => {
        try {
            const response = await fetch("/api/debts");
            if (response.ok) {
                const data = await response.json();
                setDebts(data);
            }
        } catch (error) {
            console.error("Error fetching debts:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDebts();
    }, [fetchDebts]);

    const handleAddDebt = async () => {
        if (!formData.name || !formData.totalAmount || !formData.installmentCount ||
            !formData.installmentValue || !formData.firstDueDate) {
            toast.error("Preencha todos os campos");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch("/api/debts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Erro ao criar dívida");

            const newDebt = await response.json();
            setDebts((prev) => [newDebt, ...prev]);
            toast.success("Dívida adicionada!");
            setShowAddModal(false);
            setFormData({
                name: "",
                totalAmount: "",
                installmentCount: "",
                installmentValue: "",
                firstDueDate: new Date().toISOString().split("T")[0],
            });
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar dívida");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePayInstallment = async (debtId: string, installmentId: string) => {
        try {
            const response = await fetch(`/api/installments/${installmentId}/pay`, {
                method: "POST",
            });

            if (!response.ok) throw new Error("Erro ao pagar parcela");

            // Update local state
            setDebts((prev) =>
                prev.map((debt) => {
                    if (debt.id === debtId) {
                        return {
                            ...debt,
                            installments: debt.installments.map((inst) =>
                                inst.id === installmentId
                                    ? { ...inst, isPaid: true, paidAt: new Date().toISOString() }
                                    : inst
                            ),
                        };
                    }
                    return debt;
                })
            );

            toast.success("Parcela paga! ✅");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao pagar parcela");
        }
    };

    const handleDeleteDebt = async () => {
        if (!deleteDebt) return;

        try {
            const response = await fetch(`/api/debts/${deleteDebt.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erro ao excluir");

            setDebts((prev) => prev.filter((d) => d.id !== deleteDebt.id));
            toast.success("Dívida excluída!");
            setDeleteDebt(null);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir dívida");
        }
    };

    const formatCurrency = (value: number) => {
        if (isPrivateMode) return "R$ ••••";
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
        });
    };

    // Auto-calculate installment value
    useEffect(() => {
        if (formData.totalAmount && formData.installmentCount) {
            const total = parseFloat(formData.totalAmount);
            const count = parseInt(formData.installmentCount);
            if (total > 0 && count > 0) {
                setFormData((prev) => ({
                    ...prev,
                    installmentValue: (total / count).toFixed(2),
                }));
            }
        }
    }, [formData.totalAmount, formData.installmentCount]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold">Dívidas & Parcelas</h1>
                    <p className="text-white/50 text-sm">{debts.length} dívidas</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="p-3 rounded-xl bg-accent-green/20 text-accent-green hover:bg-accent-green/30 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </motion.div>

            {/* Debts List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                {isLoading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : debts.length > 0 ? (
                    <AnimatePresence>
                        {debts.map((debt) => {
                            const paidCount = debt.installments.filter((i) => i.isPaid).length;
                            const progress = (paidCount / debt.installmentCount) * 100;
                            const isExpanded = expandedDebt === debt.id;

                            return (
                                <motion.div
                                    key={debt.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="glass-card overflow-hidden"
                                >
                                    {/* Header */}
                                    <button
                                        onClick={() => setExpandedDebt(isExpanded ? null : debt.id)}
                                        className="w-full p-4 text-left"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg">{debt.name}</h3>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteDebt(debt);
                                                }}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                <Trash2 size={16} className="text-white/40" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className={`font-medium ${isPrivateMode ? "discrete-blur" : ""}`}>
                                                {formatCurrency(debt.totalAmount)}
                                            </span>
                                            <span className="text-accent-green">
                                                {paidCount}/{debt.installmentCount} pagas
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="progress-bar mt-3">
                                            <div
                                                className="progress-bar-fill bg-accent-green"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </button>

                                    {/* Installments */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5"
                                            >
                                                <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                                                    {debt.installments.map((inst) => (
                                                        <div
                                                            key={inst.id}
                                                            className={`flex items-center justify-between p-3 rounded-xl ${inst.isPaid
                                                                    ? "bg-accent-green/10"
                                                                    : "bg-white/5"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-medium w-16">
                                                                    {inst.number}ª parcela
                                                                </span>
                                                                <span className="text-xs text-white/50">
                                                                    {formatDate(inst.dueDate)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-sm ${isPrivateMode ? "discrete-blur" : ""}`}>
                                                                    {formatCurrency(inst.amount)}
                                                                </span>
                                                                {inst.isPaid ? (
                                                                    <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center">
                                                                        <Check size={16} className="text-accent-green" />
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handlePayInstallment(debt.id, inst.id)}
                                                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent-green/20 flex items-center justify-center transition-colors"
                                                                    >
                                                                        <Check size={16} className="text-white/60" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                ) : (
                    <div className="glass-card p-8 text-center">
                        <span className="text-4xl mb-3 block">💳</span>
                        <p className="text-white/50">Nenhuma dívida registrada</p>
                        <p className="text-sm text-white/30 mt-1">
                            Adicione suas dívidas parceladas para controlar os pagamentos
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Add Debt Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nova Dívida">
                <div className="space-y-4">
                    <Input
                        label="Nome da dívida"
                        placeholder="Ex: Cartão Nubank, Empréstimo..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Valor total"
                            type="number"
                            placeholder="0,00"
                            value={formData.totalAmount}
                            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                        />
                        <Input
                            label="Nº de parcelas"
                            type="number"
                            placeholder="12"
                            value={formData.installmentCount}
                            onChange={(e) => setFormData({ ...formData, installmentCount: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Valor parcela"
                            type="number"
                            placeholder="0,00"
                            value={formData.installmentValue}
                            onChange={(e) => setFormData({ ...formData, installmentValue: e.target.value })}
                        />
                        <Input
                            label="1ª parcela"
                            type="date"
                            value={formData.firstDueDate}
                            onChange={(e) => setFormData({ ...formData, firstDueDate: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={handleAddDebt}
                        disabled={isSaving}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {isSaving ? "Salvando..." : "Adicionar Dívida"}
                    </button>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <Modal isOpen={!!deleteDebt} onClose={() => setDeleteDebt(null)} title="Excluir Dívida">
                <div className="space-y-4">
                    <p className="text-white/70">
                        Tem certeza que deseja excluir a dívida "{deleteDebt?.name}"?
                    </p>
                    <p className="text-sm text-white/50">
                        Todas as parcelas serão excluídas, mas os gastos já registrados serão mantidos.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setDeleteDebt(null)} className="btn-secondary flex-1">
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeleteDebt}
                            className="flex-1 px-6 py-3 rounded-2xl font-semibold text-white bg-accent-red hover:bg-red-600"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

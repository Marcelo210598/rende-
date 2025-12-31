"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, DollarSign } from "lucide-react";
import DebtProgress from "@/components/DebtProgress";

interface Installment {
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
    status: string;
    installments: Installment[];
}

export default function DebtDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const debtId = params?.id as string;

    const [debt, setDebt] = useState<Debt | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (debtId) {
            fetchDebt();
        }
    }, [debtId]);

    const fetchDebt = async () => {
        try {
            const response = await fetch(`/api/debts/${debtId}`);
            if (response.ok) {
                setDebt(await response.json());
            }
        } catch (error) {
            console.error('Error fetching debt:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayInstallment = async (installmentId: string) => {
        try {
            const response = await fetch(`/api/installments/${installmentId}/pay`, {
                method: 'POST',
            });

            if (response.ok) {
                fetchDebt(); // Refresh data
            }
        } catch (error) {
            console.error('Error paying installment:', error);
        }
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/50">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!debt) {
        return (
            <div className="text-center py-12">
                <p className="text-white/50">Dívida não encontrada</p>
            </div>
        );
    }

    const paidInstallments = debt.installments.filter(i => i.isPaid);
    const pendingInstallments = debt.installments.filter(i => !i.isPaid);
    const currentInstallment = pendingInstallments[0];

    const totalPaid = paidInstallments.reduce((sum, i) => sum + i.amount, 0);
    const totalRemaining = pendingInstallments.reduce((sum, i) => sum + i.amount, 0);
    const progress = (paidInstallments.length / debt.installmentCount) * 100;

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">{debt.name}</h1>
                    <p className="text-white/50 text-sm">Detalhes da dívida</p>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-4"
            >
                <div className="bg-dark-card/30 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                    <p className="text-xs text-white/50 mb-1">Total da Dívida</p>
                    <p className="text-xl font-bold text-white">
                        {formatCurrency(debt.totalAmount)}
                    </p>
                </div>

                <div className="bg-dark-card/30 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                    <p className="text-xs text-white/50 mb-1">Valor da Parcela</p>
                    <p className="text-xl font-bold text-white">
                        {formatCurrency(debt.installmentValue)}
                    </p>
                </div>

                <div className="bg-dark-card/30 backdrop-blur-md border border-accent-green/20 rounded-2xl p-5">
                    <p className="text-xs text-white/50 mb-1">Total Pago</p>
                    <p className="text-xl font-bold text-accent-green">
                        {formatCurrency(totalPaid)}
                    </p>
                </div>

                <div className="bg-dark-card/30 backdrop-blur-md border border-accent-red/20 rounded-2xl p-5">
                    <p className="text-xs text-white/50 mb-1">Restante</p>
                    <p className="text-xl font-bold text-accent-red">
                        {formatCurrency(totalRemaining)}
                    </p>
                </div>
            </motion.div>

            {/* Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-dark-card/30 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
                <h2 className="text-lg font-semibold mb-4">Progresso</h2>
                <DebtProgress
                    totalInstallments={debt.installmentCount}
                    paidInstallments={paidInstallments.length}
                    currentInstallment={currentInstallment?.number || debt.installmentCount}
                />
            </motion.div>

            {/* Installments Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">Todas as Parcelas</h2>
                <div className="space-y-3">
                    {debt.installments.map((installment) => (
                        <div
                            key={installment.id}
                            className={`
                                bg-dark-card/30 backdrop-blur-md border rounded-2xl p-4
                                ${installment.isPaid
                                    ? 'border-accent-green/30 bg-accent-green/5'
                                    : 'border-white/10'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {installment.isPaid ? (
                                        <CheckCircle2 className="w-5 h-5 text-accent-green" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-white/30" />
                                    )}
                                    <div>
                                        <p className="font-medium text-white">
                                            Parcela {installment.number}/{debt.installmentCount}
                                        </p>
                                        <p className="text-xs text-white/50">
                                            Vencimento: {formatDate(installment.dueDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={`font-bold ${installment.isPaid ? 'text-accent-green' : 'text-white'}`}>
                                        {formatCurrency(installment.amount)}
                                    </p>
                                    {installment.isPaid && installment.paidAt && (
                                        <p className="text-xs text-white/40">
                                            Pago em {new Date(installment.paidAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    )}
                                    {!installment.isPaid && (
                                        <button
                                            onClick={() => handlePayInstallment(installment.id)}
                                            className="text-xs text-accent-green hover:underline mt-1"
                                        >
                                            Marcar como paga
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

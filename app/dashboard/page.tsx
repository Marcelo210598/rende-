"use client";

import { motion } from "framer-motion";
import { TrendingUp, Wallet, PieChart, Plus } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
    const router = useRouter();

    // TODO: Replace with real data from database/API
    const hasAssets = false;
    const totalPatrimony = 0;
    const monthlyGain = 0;
    const totalAssets = 0;
    const yearPercentage = 0;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="p-6 space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold"
                >
                    Olá, Investidor! 👋
                </motion.h1>
                <p className="text-gray-400">Acompanhe seu patrimônio em tempo real</p>
            </div>

            <div className="px-6 space-y-6">
                {/* Total Portfolio Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="bg-gradient-to-br from-primary to-primary-light">
                        <div className="space-y-2">
                            <p className="text-white/80 text-sm font-bold">Patrimônio Total</p>
                            <h2 className="text-4xl font-bold">
                                R$ {totalPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h2>
                            <div className="flex items-center gap-2 text-white">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-bold">{yearPercentage}% este ano</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <GlassCard className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-gray-400 text-sm">Ganho Mensal</p>
                        <p className="text-xl font-bold text-primary">
                            R$ {monthlyGain.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                    </GlassCard>

                    <GlassCard className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-accent-red/20 flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-accent-red" />
                        </div>
                        <p className="text-gray-400 text-sm">Ativos</p>
                        <p className="text-xl font-bold">{totalAssets}</p>
                    </GlassCard>
                </motion.div>

                {/* Empty State or Content */}
                {!hasAssets ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <GlassCard className="text-center py-12 space-y-6">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <Wallet className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Sua carteira está vazia</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    Adicione seu primeiro investimento para começar a acompanhar seu patrimônio em tempo real.
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push("/adicionar-ativo")}
                                className="mx-auto"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Adicionar Primeiro Ativo
                            </Button>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <>
                        {/* Portfolio Chart - Will show when user has assets */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <GlassCard>
                                <h3 className="font-bold mb-4">Evolução do Patrimônio</h3>
                                <div className="h-[200px] flex items-center justify-center text-gray-400">
                                    Dados serão exibidos após adicionar ativos
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Asset Distribution - Will show when user has assets */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <GlassCard>
                                <h3 className="font-bold mb-4">Distribuição de Ativos</h3>
                                <div className="h-[150px] flex items-center justify-center text-gray-400">
                                    Adicione ativos para ver a distribuição
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Top Assets - Will show when user has assets */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <GlassCard>
                                <h3 className="font-bold mb-4">Principais Ativos</h3>
                                <div className="py-8 text-center text-gray-400">
                                    Nenhum ativo cadastrado
                                </div>
                            </GlassCard>
                        </motion.div>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
}

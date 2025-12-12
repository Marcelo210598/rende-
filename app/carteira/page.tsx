"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Plus, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/BottomNav";

const tabs = ["Ações", "FIIs", "Cripto", "Renda Fixa"];

export default function CarteiraPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    // TODO: Replace with real data from database/API
    const hasAssets = false;
    const totalValue = 0;
    const percentageChange = 0;
    const absoluteChange = 0;
    const assetsCount = 0;
    const totalInvested = 0;
    const totalReturn = 0;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Minha Carteira</h1>
                        <p className="text-gray-400 text-sm">Detalhes dos seus investimentos</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/adicionar-ativo")}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-light flex items-center justify-center hover:scale-105 transition-transform"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="px-6 space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(index)}
                            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === index
                                    ? "bg-gradient-to-r from-primary to-primary-light text-white"
                                    : "glass-card text-gray-400 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Summary Card */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-light/20 border border-primary/30">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total em {tabs[activeTab]}</p>
                                    <h2 className="text-3xl font-bold">
                                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-primary font-bold">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{percentageChange}%</span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        R$ {absoluteChange.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-xs text-gray-400">Ativos</p>
                                    <p className="text-lg font-bold">{assetsCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Investido</p>
                                    <p className="text-lg font-bold">
                                        R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Rendimento</p>
                                    <p className="text-lg font-bold text-primary">
                                        R$ {totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Empty State or Content */}
                {!hasAssets ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlassCard className="text-center py-12 space-y-6">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <Wallet className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Nenhum ativo em {tabs[activeTab]}</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    Comece adicionando seus investimentos para acompanhar o desempenho da sua carteira.
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push("/adicionar-ativo")}
                                className="mx-auto"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Adicionar Ativo
                            </Button>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <>
                        {/* Performance Chart - Will show when user has assets */}
                        <GlassCard>
                            <h3 className="font-bold mb-4">Desempenho (6 meses)</h3>
                            <div className="h-[180px] flex items-center justify-center text-gray-400">
                                Dados serão exibidos após adicionar ativos
                            </div>
                        </GlassCard>

                        {/* Assets List - Will show when user has assets */}
                        <div className="space-y-3">
                            <h3 className="font-bold">Ativos em Carteira</h3>
                            <GlassCard className="text-center py-8 text-gray-400">
                                Nenhum ativo cadastrado
                            </GlassCard>
                        </div>
                    </>
                )}

                {/* Add Asset Button */}
                <Button
                    onClick={() => router.push("/adicionar-ativo")}
                    className="w-full"
                    variant="glass"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Novo Ativo
                </Button>
            </div>

            <BottomNav />
        </div>
    );
}

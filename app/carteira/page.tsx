"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/BottomNav";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const tabs = ["Ações", "FIIs", "Cripto", "Renda Fixa"];

const stocksData = [
    { name: "PETR4", qty: 100, avgPrice: "R$ 28,50", current: "R$ 32,10", total: "R$ 3.210", change: "+12.6%" },
    { name: "VALE3", qty: 80, avgPrice: "R$ 65,20", current: "R$ 70,50", total: "R$ 5.640", change: "+8.1%" },
    { name: "ITUB4", qty: 150, avgPrice: "R$ 24,80", current: "R$ 26,30", total: "R$ 3.945", change: "+6.0%" },
];

const performanceData = [
    { month: "Jan", value: 100 },
    { month: "Fev", value: 120 },
    { month: "Mar", value: 115 },
    { month: "Abr", value: 140 },
    { month: "Mai", value: 165 },
    { month: "Jun", value: 182 },
];

export default function CarteiraPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

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
                                    <h2 className="text-3xl font-bold">R$ 12.795,00</h2>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-primary font-bold">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>+9.2%</span>
                                    </div>
                                    <p className="text-sm text-gray-400">+R$ 1.080</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-xs text-gray-400">Ativos</p>
                                    <p className="text-lg font-bold">3</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Investido</p>
                                    <p className="text-lg font-bold">R$ 11.715</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Rendimento</p>
                                    <p className="text-lg font-bold text-primary">R$ 1.080</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Performance Chart */}
                <GlassCard>
                    <h3 className="font-bold mb-4">Desempenho (6 meses)</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(26, 31, 46, 0.9)",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "white",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#00D1B2"
                                strokeWidth={3}
                                dot={{ fill: "#00D1B2", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </GlassCard>

                {/* Assets List */}
                <div className="space-y-3">
                    <h3 className="font-bold">Ativos em Carteira</h3>
                    {stocksData.map((stock, index) => (
                        <motion.div
                            key={stock.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-bold text-lg">{stock.name}</h4>
                                        <p className="text-sm text-gray-400">{stock.qty} cotas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{stock.total}</p>
                                        <p className="text-sm text-primary font-bold">{stock.change}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-400">Preço Médio</p>
                                        <p className="text-sm font-bold">{stock.avgPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Preço Atual</p>
                                        <p className="text-sm font-bold">{stock.current}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

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

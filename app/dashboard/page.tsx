"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import BottomNav from "@/components/BottomNav";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

const portfolioData = [
    { month: "Jan", value: 10000 },
    { month: "Fev", value: 12000 },
    { month: "Mar", value: 11500 },
    { month: "Abr", value: 14000 },
    { month: "Mai", value: 16500 },
    { month: "Jun", value: 18200 },
];

const assetDistribution = [
    { name: "Ações", value: 45, color: "#00D1B2" },
    { name: "FIIs", value: 25, color: "#00E7C0" },
    { name: "Cripto", value: 20, color: "#FF4D6D" },
    { name: "Renda Fixa", value: 10, color: "#6B7280" },
];

const topAssets = [
    { name: "PETR4", value: "R$ 5.240,00", change: "+12.5%", positive: true },
    { name: "VALE3", value: "R$ 4.180,00", change: "+8.3%", positive: true },
    { name: "MXRF11", value: "R$ 3.920,00", change: "-2.1%", positive: false },
    { name: "BTC", value: "R$ 2.850,00", change: "+25.7%", positive: true },
];

export default function DashboardPage() {
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
                            <h2 className="text-4xl font-bold">R$ 18.200,00</h2>
                            <div className="flex items-center gap-2 text-white">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-bold">+82% este ano</span>
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
                        <p className="text-xl font-bold text-primary">+R$ 1.700</p>
                    </GlassCard>

                    <GlassCard className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-accent-red/20 flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-accent-red" />
                        </div>
                        <p className="text-gray-400 text-sm">Ativos</p>
                        <p className="text-xl font-bold">24</p>
                    </GlassCard>
                </motion.div>

                {/* Portfolio Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <GlassCard>
                        <h3 className="font-bold mb-4">Evolução do Patrimônio</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={portfolioData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D1B2" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00D1B2" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
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
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#00D1B2"
                                    strokeWidth={3}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </GlassCard>
                </motion.div>

                {/* Asset Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <GlassCard>
                        <h3 className="font-bold mb-4">Distribuição de Ativos</h3>
                        <div className="flex items-center justify-between">
                            <ResponsiveContainer width="50%" height={150}>
                                <RePieChart>
                                    <Pie
                                        data={assetDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {assetDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </RePieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2">
                                {assetDistribution.map((asset) => (
                                    <div key={asset.name} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: asset.color }}
                                        />
                                        <span className="text-sm text-gray-400">{asset.name}</span>
                                        <span className="text-sm font-bold ml-auto">{asset.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Top Assets */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <GlassCard>
                        <h3 className="font-bold mb-4">Principais Ativos</h3>
                        <div className="space-y-3">
                            {topAssets.map((asset, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                                >
                                    <div>
                                        <p className="font-bold">{asset.name}</p>
                                        <p className="text-sm text-gray-400">{asset.value}</p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 font-bold ${asset.positive ? "text-primary" : "text-accent-red"
                                            }`}
                                    >
                                        {asset.positive ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4" />
                                        )}
                                        <span>{asset.change}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            <BottomNav />
        </div>
    );
}

"use client";

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface AssetPerformance {
    name: string;
    profitLoss: number;
    profitLossPercent: number;
    currentValue: number;
    invested: number;
}

interface ProfitLossChartProps {
    assets: AssetPerformance[];
    totalProfitLoss: number;
    totalProfitLossPercent: number;
}

type Period = 'today' | 'month' | 'year' | 'all';

export default function ProfitLossChart({ assets, totalProfitLoss, totalProfitLossPercent }: ProfitLossChartProps) {
    const [period, setPeriod] = useState<Period>('all');
    const [chartType, setChartType] = useState<'line' | 'bar'>('bar');

    const isPositive = totalProfitLoss >= 0;

    // Prepare data for charts
    const chartData = assets.map(asset => ({
        name: asset.name.length > 10 ? asset.name.substring(0, 10) + '...' : asset.name,
        'Lucro/Prejuízo': asset.profitLoss,
        'Rentabilidade %': asset.profitLossPercent,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const isProfit = data.value >= 0;

            return (
                <div className="bg-[#1A1F2E]/95 backdrop-blur-lg border border-white/10 rounded-xl p-3">
                    <p className="text-sm font-bold text-white mb-1">{data.payload.name}</p>
                    <p className={`text-sm font-bold ${isProfit ? 'text-primary' : 'text-accent-red'}`}>
                        {data.dataKey === 'Rentabilidade %'
                            ? `${data.value.toFixed(2)}%`
                            : `R$ ${data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        }
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <GlassCard className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg">Lucro/Prejuízo</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-primary" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-accent-red" />
                        )}
                        <span className={`text-sm font-bold ${isPositive ? 'text-primary' : 'text-accent-red'}`}>
                            R$ {Math.abs(totalProfitLoss).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-xs ${isPositive ? 'text-primary' : 'text-accent-red'}`}>
                            ({isPositive ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                {/* Chart Type Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${chartType === 'bar'
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        Barras
                    </button>
                    <button
                        onClick={() => setChartType('line')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${chartType === 'line'
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        Linha
                    </button>
                </div>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['today', 'month', 'year', 'all'] as Period[]).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${period === p
                                ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {p === 'today' && 'Hoje'}
                        {p === 'month' && 'Mês'}
                        {p === 'year' && 'Ano'}
                        {p === 'all' && 'Tudo'}
                    </button>
                ))}
            </div>

            {/* Chart */}
            {assets.length > 0 ? (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    fontSize={12}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="Lucro/Prejuízo"
                                    fill="#00D1B2"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    fontSize={12}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="Lucro/Prejuízo"
                                    stroke="#00D1B2"
                                    strokeWidth={2}
                                    dot={{ fill: '#00D1B2', r: 4 }}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                    <p className="text-sm">Adicione ativos para ver o gráfico</p>
                </div>
            )}
        </GlassCard>
    );
}

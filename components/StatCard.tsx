"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    icon: React.ReactNode;
    subtitle?: string;
}

export default function StatCard({ title, value, change, trend, icon, subtitle }: StatCardProps) {
    const getTrendColor = () => {
        if (!trend) return 'text-white/50';
        return trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-accent-green' : 'text-white/50';
    };

    const getTrendIcon = () => {
        if (!trend || trend === 'stable') return <Minus className="w-4 h-4" />;
        return trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
    };

    return (
        <div className="bg-dark-card/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-dark-card/40 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm text-white/50 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                    {subtitle && (
                        <p className="text-xs text-white/40 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className="p-3 bg-accent-green/10 rounded-xl">
                    <div className="text-accent-green">
                        {icon}
                    </div>
                </div>
            </div>

            {/* Trend */}
            {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                    {getTrendIcon()}
                    <span className="font-medium">
                        {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="text-white/30">vs mês anterior</span>
                </div>
            )}
        </div>
    );
}

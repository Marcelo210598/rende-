"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryData {
    category: {
        id: string;
        name: string;
        emoji: string;
    };
    amount: number;
}

interface DonutChartProps {
    data: CategoryData[];
    totalAmount: number;
    isDiscreteMode?: boolean;
}

const COLORS = [
    "#10B981", // green
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#F59E0B", // orange
    "#EC4899", // pink
    "#EF4444", // red
    "#14B8A6", // teal
    "#6366F1", // indigo
    "#F97316", // orange-500
    "#84CC16", // lime
];

export default function DonutChart({ data, totalAmount, isDiscreteMode }: DonutChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-white/40">
                <span className="text-4xl mb-2">📊</span>
                <p>Nenhum gasto registrado</p>
            </div>
        );
    }

    const chartData = data.map((item, index) => ({
        name: `${item.category.emoji} ${item.category.name}`,
        value: item.amount,
        color: COLORS[index % COLORS.length],
        emoji: item.category.emoji,
        categoryName: item.category.name,
    }));

    const formatCurrency = (value: number) => {
        if (isDiscreteMode) return "••••";
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="glass-card p-3 text-sm">
                    <p className="font-medium">{data.emoji} {data.categoryName}</p>
                    <p className="text-white/70">{formatCurrency(data.value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-xs text-white/50">Total</p>
                <p className={`text-lg font-bold ${isDiscreteMode ? "discrete-blur" : ""}`}>
                    {formatCurrency(totalAmount)}
                </p>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
                {chartData.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/70 truncate">
                            {item.emoji} {item.categoryName}
                        </span>
                    </div>
                ))}
                {chartData.length > 6 && (
                    <div className="text-sm text-white/50">
                        +{chartData.length - 6} mais
                    </div>
                )}
            </div>
        </div>
    );
}

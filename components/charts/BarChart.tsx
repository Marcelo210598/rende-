"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface BarChartProps {
    income: number;
    expenses: number;
    isDiscreteMode?: boolean;
}

export default function BarChart({ income, expenses, isDiscreteMode }: BarChartProps) {
    const data = [
        { name: "Renda", value: income, color: "#10B981" },
        { name: "Gastos", value: expenses, color: "#EF4444" },
    ];

    const formatCurrency = (value: number) => {
        if (isDiscreteMode) return "••••";
        if (value >= 1000) {
            return `R$ ${(value / 1000).toFixed(1)}k`;
        }
        return `R$ ${value.toFixed(0)}`;
    };

    return (
        <ResponsiveContainer width="100%" height={120}>
            <RechartsBarChart data={data} layout="vertical" barSize={24}>
                <XAxis type="number" hide />
                <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    width={60}
                />
                <Bar
                    dataKey="value"
                    radius={[0, 8, 8, 0]}
                    label={{
                        position: "right",
                        fill: "rgba(255,255,255,0.8)",
                        fontSize: 12,
                        formatter: (value: unknown) => formatCurrency(Number(value) || 0),
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}

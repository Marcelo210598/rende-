"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("skeleton", className)} />
    );
}

export function CardSkeleton() {
    return (
        <div className="glass-card p-6 space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

export function ExpenseItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 glass-card">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-20" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="glass-card p-6">
            <Skeleton className="h-4 w-1/4 mb-4" />
            <div className="flex items-center justify-center">
                <Skeleton className="w-40 h-40 rounded-full" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="pt-4">
                <Skeleton className="h-8 w-48" />
            </div>

            {/* Summary Card */}
            <CardSkeleton />

            {/* Chart */}
            <ChartSkeleton />

            {/* Recent */}
            <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <ExpenseItemSkeleton />
                <ExpenseItemSkeleton />
                <ExpenseItemSkeleton />
            </div>
        </div>
    );
}

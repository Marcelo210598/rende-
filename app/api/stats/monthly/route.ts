import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/stats/monthly - Get monthly statistics
export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
        const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

        // Get expenses for the month
        const expenses = await prisma.expense.findMany({
            where: {
                userId: user.id,
                month,
                year,
            },
            include: {
                category: true,
            },
        });

        // Calculate total
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Group by category
        const byCategory = expenses.reduce((acc, exp) => {
            const existing = acc.find(item => item.categoryId === exp.categoryId);
            if (existing) {
                existing.amount += exp.amount;
                existing.count += 1;
            } else {
                acc.push({
                    categoryId: exp.categoryId,
                    category: exp.category,
                    amount: exp.amount,
                    count: 1,
                });
            }
            return acc;
        }, [] as Array<{ categoryId: string, category: any, amount: number, count: number }>);

        // Sort by amount desc
        byCategory.sort((a, b) => b.amount - a.amount);

        // Get previous month stats for comparison
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;

        const prevExpenses = await prisma.expense.findMany({
            where: {
                userId: user.id,
                month: prevMonth,
                year: prevYear,
            },
        });

        const prevTotal = prevExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const percentageChange = prevTotal > 0 ? ((totalExpenses - prevTotal) / prevTotal) * 100 : 0;

        // Daily average
        const daysInMonth = new Date(year, month, 0).getDate();
        const dailyAverage = totalExpenses / daysInMonth;

        return NextResponse.json({
            month,
            year,
            totalExpenses,
            byCategory,
            comparison: {
                previousMonth: prevTotal,
                percentageChange,
                trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable',
            },
            dailyAverage,
            expenseCount: expenses.length,
        });
    } catch (error) {
        console.error("Error fetching monthly stats:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

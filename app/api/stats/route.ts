import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/stats - Get dashboard statistics
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

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Total expenses this month
        const totalExpenses = await prisma.expense.aggregate({
            where: {
                userId: user.id,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: { amount: true },
        });

        // Expenses by category
        const expensesByCategory = await prisma.expense.groupBy({
            by: ["categoryId"],
            where: {
                userId: user.id,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: { amount: true },
        });

        // Get category details
        const categoryIds = expensesByCategory.map((e) => e.categoryId);
        const categories = await prisma.category.findMany({
            where: { id: { in: categoryIds } },
        });

        const categoryMap = new Map(categories.map((c) => [c.id, c]));
        const categoriesWithSpending = expensesByCategory.map((e) => ({
            category: categoryMap.get(e.categoryId),
            amount: e._sum.amount || 0,
        })).sort((a, b) => (b.amount || 0) - (a.amount || 0));

        // Recent expenses
        const recentExpenses = await prisma.expense.findMany({
            where: { userId: user.id },
            include: { category: true },
            orderBy: { date: "desc" },
            take: 5,
        });

        // Pending installments
        const pendingInstallments = await prisma.debtInstallment.count({
            where: {
                debt: { userId: user.id },
                isPaid: false,
                dueDate: {
                    lte: new Date(year, month, 0), // Until end of month
                },
            },
        });

        // Budget alerts (categories exceeding limit)
        const budgets = await prisma.budget.findMany({
            where: {
                userId: user.id,
                month,
                year,
            },
            include: { category: true },
        });

        const budgetAlerts = [];
        for (const budget of budgets) {
            const spending = categoriesWithSpending.find(
                (c) => c.category?.id === budget.categoryId
            );
            const spent = spending?.amount || 0;
            if (spent > budget.monthlyLimit) {
                budgetAlerts.push({
                    category: budget.category,
                    limit: budget.monthlyLimit,
                    spent,
                    exceeded: spent - budget.monthlyLimit,
                });
            }
        }

        return NextResponse.json({
            monthlyIncome: user.monthlyIncome,
            totalExpenses: totalExpenses._sum.amount || 0,
            balance: user.monthlyIncome - (totalExpenses._sum.amount || 0),
            categoriesWithSpending,
            recentExpenses,
            pendingInstallments,
            budgetAlerts,
            month,
            year,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

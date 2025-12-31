import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/budgets - Get all budgets for current month/year
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

        const budgets = await prisma.budget.findMany({
            where: {
                userId: user.id,
                month,
                year,
            },
            include: { category: true },
        });

        // Calculate spending for each budget category
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const budgetsWithSpending = await Promise.all(
            budgets.map(async (budget) => {
                const spending = await prisma.expense.aggregate({
                    where: {
                        userId: user.id,
                        categoryId: budget.categoryId,
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    _sum: { amount: true },
                });

                return {
                    ...budget,
                    spent: spending._sum.amount || 0,
                    remaining: budget.monthlyLimit - (spending._sum.amount || 0),
                    percentage: ((spending._sum.amount || 0) / budget.monthlyLimit) * 100,
                };
            })
        );

        return NextResponse.json(budgetsWithSpending);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/budgets - Create or update budget
export async function POST(request: Request) {
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

        const body = await request.json();
        const { categoryId, monthlyLimit, month, year } = body;

        if (!categoryId || !monthlyLimit) {
            return NextResponse.json({ error: "Category and limit are required" }, { status: 400 });
        }

        const currentMonth = month || new Date().getMonth() + 1;
        const currentYear = year || new Date().getFullYear();

        const budget = await prisma.budget.upsert({
            where: {
                userId_categoryId_month_year: {
                    userId: user.id,
                    categoryId,
                    month: currentMonth,
                    year: currentYear,
                },
            },
            update: {
                monthlyLimit: parseFloat(monthlyLimit),
            },
            create: {
                userId: user.id,
                categoryId,
                monthlyLimit: parseFloat(monthlyLimit),
                month: currentMonth,
                year: currentYear,
            },
            include: { category: true },
        });

        return NextResponse.json(budget);
    } catch (error) {
        console.error("Error creating budget:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

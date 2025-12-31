import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/expenses - Get all expenses
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
        const categoryId = searchParams.get("categoryId");
        const search = searchParams.get("search");
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const limit = searchParams.get("limit");

        // Build filters
        const where: Record<string, unknown> = {
            userId: user.id,
        };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (search) {
            where.note = {
                contains: search,
                mode: "insensitive",
            };
        }

        // Filter by month/year using new fields
        if (month && year) {
            where.month = parseInt(month);
            where.year = parseInt(year);
        }

        const expenses = await prisma.expense.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: { date: "desc" },
            take: limit ? parseInt(limit) : undefined,
        });

        return NextResponse.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/expenses - Create new expense
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
        const { categoryId, amount, note, date, month, year, installmentId } = body;

        if (!categoryId || !amount) {
            return NextResponse.json({ error: "Category and amount are required" }, { status: 400 });
        }

        const expenseDate = date ? new Date(date) : new Date();

        // Calculate month/year from date if not provided
        const expenseMonth = month ?? (expenseDate.getMonth() + 1);
        const expenseYear = year ?? expenseDate.getFullYear();

        const expense = await prisma.expense.create({
            data: {
                userId: user.id,
                categoryId,
                amount: parseFloat(amount),
                note: note || null,
                date: expenseDate,
                month: expenseMonth,
                year: expenseYear,
                installmentId: installmentId || null,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("Error creating expense:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

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
    const month = parseInt(
      searchParams.get("month") || String(new Date().getMonth() + 1),
    );
    const year = parseInt(
      searchParams.get("year") || String(new Date().getFullYear()),
    );

    // Get incomes for the month
    const incomes = await prisma.income.findMany({
      where: {
        userId: user.id,
        month,
        year,
      },
    });

    // Calculate total income (incomes + fixed monthly income if any)
    const totalIncomesVariable = incomes.reduce(
      (sum, inc) => sum + inc.amount,
      0,
    );
    // We assume user.monthlyIncome is a base salary that applies every month.
    // If we strictly track via Income model, this might be double counting if user adds it there.
    // For now, let's treat user.monthlyIncome as the "default" and Income table as "extras" OR specific entries.
    // A safer bet for "Melhorias" is to use Income table primarily if populated, but allow user.monthlyIncome as fallback/base.
    // Let's summing them for now as per "Rende+" usually implies fixed income + extras.
    const totalIncome = user.monthlyIncome + totalIncomesVariable;

    // Calculate total
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Group by category
    const byCategory = expenses.reduce(
      (acc, exp) => {
        const existing = acc.find((item) => item.categoryId === exp.categoryId);
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
      },
      [] as Array<{
        categoryId: string;
        category: any;
        amount: number;
        count: number;
      }>,
    );

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

    const prevIncomes = await prisma.income.findMany({
      where: {
        userId: user.id,
        month: prevMonth,
        year: prevYear,
      },
    });

    const prevTotal = prevExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const prevTotalIncome =
      user.monthlyIncome +
      prevIncomes.reduce((sum, inc) => sum + inc.amount, 0);

    const percentageChange =
      prevTotal > 0 ? ((totalExpenses - prevTotal) / prevTotal) * 100 : 0;

    // Daily average
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyAverage = totalExpenses / daysInMonth;

    // 6-Month Evolution
    const evolution = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();

      const monthExpenses = await prisma.expense.aggregate({
        where: { userId: user.id, month: m, year: y },
        _sum: { amount: true },
      });

      const monthIncomes = await prisma.income.aggregate({
        where: { userId: user.id, month: m, year: y },
        _sum: { amount: true },
      });

      evolution.push({
        month: d.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase(),
        income: user.monthlyIncome + (monthIncomes._sum.amount || 0),
        expenses: monthExpenses._sum.amount || 0,
      });
    }

    return NextResponse.json({
      month,
      year,
      summary: {
        income: totalIncome,
        expenses: totalExpenses,
        balance: totalIncome - totalExpenses,
        savings: totalIncome - totalExpenses, // Simplified savings = balance
      },
      totalExpenses, // keeping for backward compatibility if needed
      byCategory,
      evolution,
      comparison: {
        previousMonth: prevTotal,
        percentageChange,
        trend:
          percentageChange > 0
            ? "up"
            : percentageChange < 0
              ? "down"
              : "stable",
      },
      dailyAverage,
      expenseCount: expenses.length,
    });
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/installments/monthly - Get installments for the current month
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

        // Calculate month start and end dates
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get installments due in this month for active debts
        const installments = await prisma.debtInstallment.findMany({
            where: {
                debt: {
                    userId: user.id,
                    status: "active",
                },
                dueDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                debt: true,
            },
            orderBy: {
                dueDate: 'asc',
            },
        });

        const summary = {
            total: installments.length,
            totalAmount: installments.reduce((sum, i) => sum + i.amount, 0),
            paid: installments.filter(i => i.isPaid).length,
            paidAmount: installments.filter(i => i.isPaid).reduce((sum, i) => sum + i.amount, 0),
            pending: installments.filter(i => !i.isPaid).length,
            pendingAmount: installments.filter(i => !i.isPaid).reduce((sum, i) => sum + i.amount, 0),
        };

        return NextResponse.json({
            month,
            year,
            installments,
            summary,
        });
    } catch (error) {
        console.error("Error fetching monthly installments:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

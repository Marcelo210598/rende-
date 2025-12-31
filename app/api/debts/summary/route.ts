import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/debts/summary - Get summary of all debts
export async function GET() {
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

        // Get all active debts with installments
        const debts = await prisma.debt.findMany({
            where: {
                userId: user.id,
                status: "active",
            },
            include: {
                installments: {
                    orderBy: { dueDate: 'asc' },
                },
            },
        });

        const summary = debts.map(debt => {
            const paidInstallments = debt.installments.filter(i => i.isPaid);
            const remainingInstallments = debt.installments.filter(i => !i.isPaid);
            const currentInstallment = remainingInstallments[0];

            const totalPaid = paidInstallments.reduce((sum, i) => sum + i.amount, 0);
            const totalRemaining = remainingInstallments.reduce((sum, i) => sum + i.amount, 0);

            return {
                id: debt.id,
                name: debt.name,
                totalAmount: debt.totalAmount,
                totalPaid,
                totalRemaining,
                currentInstallment: currentInstallment?.number || debt.installmentCount,
                totalInstallments: debt.installmentCount,
                nextDueDate: currentInstallment?.dueDate || null,
                progress: (paidInstallments.length / debt.installmentCount) * 100,
            };
        });

        const totals = {
            activeDebts: debts.length,
            totalRemaining: summary.reduce((sum, d) => sum + d.totalRemaining, 0),
            totalPaid: summary.reduce((sum, d) => sum + d.totalPaid, 0),
        };

        return NextResponse.json({
            debts: summary,
            totals,
        });
    } catch (error) {
        console.error("Error fetching debts summary:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/debts - Get all debts with installments
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

        const debts = await prisma.debt.findMany({
            where: { userId: user.id },
            include: {
                installments: {
                    orderBy: { number: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(debts);
    } catch (error) {
        console.error("Error fetching debts:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/debts - Create new debt with auto-generated installments
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
        const { name, totalAmount, installmentCount, installmentValue, firstDueDate } = body;

        if (!name || !totalAmount || !installmentCount || !installmentValue || !firstDueDate) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Create debt with installments in a transaction
        const debt = await prisma.$transaction(async (tx) => {
            // Create the debt
            const newDebt = await tx.debt.create({
                data: {
                    userId: user.id,
                    name,
                    totalAmount: parseFloat(totalAmount),
                    installmentCount: parseInt(installmentCount),
                    installmentValue: parseFloat(installmentValue),
                    firstDueDate: new Date(firstDueDate),
                },
            });

            // Generate installments
            const installments = [];
            const firstDate = new Date(firstDueDate);

            for (let i = 0; i < parseInt(installmentCount); i++) {
                const dueDate = new Date(firstDate);
                dueDate.setMonth(dueDate.getMonth() + i);

                installments.push({
                    debtId: newDebt.id,
                    number: i + 1,
                    amount: parseFloat(installmentValue),
                    dueDate,
                });
            }

            await tx.debtInstallment.createMany({
                data: installments,
            });

            return tx.debt.findUnique({
                where: { id: newDebt.id },
                include: {
                    installments: {
                        orderBy: { number: "asc" },
                    },
                },
            });
        });

        return NextResponse.json(debt);
    } catch (error) {
        console.error("Error creating debt:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/installments/[id]/pay - Mark installment as paid (creates expense)
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Get installment with debt info
        const installment = await prisma.debtInstallment.findUnique({
            where: { id },
            include: { debt: true },
        });

        if (!installment || installment.debt.userId !== user.id) {
            return NextResponse.json({ error: "Installment not found" }, { status: 404 });
        }

        if (installment.isPaid) {
            return NextResponse.json({ error: "Installment already paid" }, { status: 400 });
        }

        // Find or get the "Dívidas" category
        const debtCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    { id: "default-dívidas" },
                    { name: "Dívidas", isDefault: true },
                ],
            },
        });

        if (!debtCategory) {
            return NextResponse.json({ error: "Debt category not found" }, { status: 500 });
        }

        // Mark as paid and create expense in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update installment
            const updatedInstallment = await tx.debtInstallment.update({
                where: { id },
                data: {
                    isPaid: true,
                    paidAt: new Date(),
                },
            });

            // Create expense linked to installment
            const expense = await tx.expense.create({
                data: {
                    userId: user.id,
                    categoryId: debtCategory.id,
                    amount: installment.amount,
                    note: `${installment.debt.name} - Parcela ${installment.number}/${installment.debt.installmentCount}`,
                    date: new Date(),
                    installmentId: id,
                },
                include: { category: true },
            });

            return { installment: updatedInstallment, expense };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error paying installment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/installments/[id]/pay - Undo payment (delete expense, mark unpaid)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        const installment = await prisma.debtInstallment.findUnique({
            where: { id },
            include: { debt: true },
        });

        if (!installment || installment.debt.userId !== user.id) {
            return NextResponse.json({ error: "Installment not found" }, { status: 404 });
        }

        if (!installment.isPaid) {
            return NextResponse.json({ error: "Installment is not paid" }, { status: 400 });
        }

        // Undo payment in transaction
        await prisma.$transaction(async (tx) => {
            // Delete expense linked to this installment
            await tx.expense.deleteMany({
                where: { installmentId: id },
            });

            // Mark installment as unpaid
            await tx.debtInstallment.update({
                where: { id },
                data: {
                    isPaid: false,
                    paidAt: null,
                },
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error undoing payment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

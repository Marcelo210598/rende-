import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/debts/[id] - Get single debt with installments
export async function GET(
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

        const debt = await prisma.debt.findUnique({
            where: { id },
            include: {
                installments: {
                    orderBy: { number: "asc" },
                },
            },
        });

        if (!debt || debt.userId !== user.id) {
            return NextResponse.json({ error: "Debt not found" }, { status: 404 });
        }

        return NextResponse.json(debt);
    } catch (error) {
        console.error("Error fetching debt:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/debts/[id] - Delete debt and all installments
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

        const debt = await prisma.debt.findUnique({
            where: { id },
        });

        if (!debt || debt.userId !== user.id) {
            return NextResponse.json({ error: "Debt not found" }, { status: 404 });
        }

        // Delete will cascade to installments due to onDelete: Cascade
        await prisma.debt.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting debt:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

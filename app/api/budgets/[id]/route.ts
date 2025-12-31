import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// DELETE /api/budgets/[id] - Delete budget
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

        const budget = await prisma.budget.findUnique({
            where: { id },
        });

        if (!budget || budget.userId !== user.id) {
            return NextResponse.json({ error: "Budget not found" }, { status: 404 });
        }

        await prisma.budget.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting budget:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

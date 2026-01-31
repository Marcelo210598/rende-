import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST - Deposit into goal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valor inválido" },
        { status: 400 }
      );
    }

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Meta não encontrada" }, { status: 404 });
    }

    if (existingGoal.isCompleted) {
      return NextResponse.json(
        { error: "Esta meta já foi concluída" },
        { status: 400 }
      );
    }

    const newAmount = existingGoal.currentAmount + parseFloat(amount);
    const isCompleted = newAmount >= existingGoal.targetAmount;

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        isCompleted,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error depositing to goal:", error);
    return NextResponse.json(
      { error: "Erro ao depositar" },
      { status: 500 }
    );
  }
}

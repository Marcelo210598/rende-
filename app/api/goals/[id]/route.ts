import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - Get single goal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Meta não encontrada" }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { error: "Erro ao buscar meta" },
      { status: 500 }
    );
  }
}

// PUT - Update goal
export async function PUT(
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

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Meta não encontrada" }, { status: 404 });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        title: body.title ?? existingGoal.title,
        targetAmount: body.targetAmount ?? existingGoal.targetAmount,
        deadline: body.deadline ? new Date(body.deadline) : existingGoal.deadline,
        category: body.category ?? existingGoal.category,
        icon: body.icon ?? existingGoal.icon,
        color: body.color ?? existingGoal.color,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar meta" },
      { status: 500 }
    );
  }
}

// DELETE - Delete goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Meta não encontrada" }, { status: 404 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { error: "Erro ao excluir meta" },
      { status: 500 }
    );
  }
}

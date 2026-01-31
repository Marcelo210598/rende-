import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - List all goals for user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isCompleted: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Erro ao buscar metas" },
      { status: 500 }
    );
  }
}

// POST - Create new goal
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, targetAmount, deadline, category, icon, color } = body;

    if (!title || !targetAmount) {
      return NextResponse.json(
        { error: "Título e valor são obrigatórios" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        deadline: deadline ? new Date(deadline) : null,
        category,
        icon,
        color,
        isCompleted: false,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Erro ao criar meta" },
      { status: 500 }
    );
  }
}

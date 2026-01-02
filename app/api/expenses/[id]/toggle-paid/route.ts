import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { isPaid } = await request.json();

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se a despesa pertence ao usuário
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Despesa não encontrada' }, { status: 404 });
    }

    // Atualizar status de pagamento
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        isPaid: isPaid,
        paidAt: isPaid ? new Date() : null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      expense: updatedExpense,
    });

  } catch (error) {
    console.error('Erro ao atualizar status de pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa' },
      { status: 500 }
    );
  }
}

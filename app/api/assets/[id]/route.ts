import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// PUT - Update an asset
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Verify asset belongs to user
        const asset = await prisma.asset.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!asset || asset.user.email !== session.user.email) {
            return NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 });
        }

        // Update asset
        const updatedAsset = await prisma.asset.update({
            where: { id },
            data: {
                ticker: body.ticker?.toUpperCase(),
                name: body.name,
                quantity: body.quantity ? parseFloat(body.quantity) : undefined,
                averagePrice: body.averagePrice ? parseFloat(body.averagePrice) : undefined,
                type: body.type
            }
        });

        return NextResponse.json(updatedAsset);
    } catch (error) {
        console.error('Error updating asset:', error);
        return NextResponse.json({ error: 'Erro ao atualizar ativo' }, { status: 500 });
    }
}

// DELETE - Delete an asset
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { id } = await params;

        // Verify asset belongs to user
        const asset = await prisma.asset.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!asset || asset.user.email !== session.user.email) {
            return NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 });
        }

        // Delete asset
        await prisma.asset.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Ativo excluído com sucesso' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        return NextResponse.json({ error: 'Erro ao excluir ativo' }, { status: 500 });
    }
}

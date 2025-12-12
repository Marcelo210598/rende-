import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch all assets for the logged-in user
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { assets: { orderBy: { createdAt: 'desc' } } }
        });

        if (!user) {
            return NextResponse.json([]);
        }

        return NextResponse.json(user.assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
        return NextResponse.json({ error: 'Erro ao buscar ativos' }, { status: 500 });
    }
}

// POST - Create a new asset
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { ticker, name, quantity, averagePrice, type } = body;

        // Validate required fields
        if (!ticker || !name || !quantity || !averagePrice || !type) {
            return NextResponse.json(
                { error: 'Campos obrigatórios faltando' },
                { status: 400 }
            );
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: session.user.email,
                    name: session.user.name || null,
                    image: session.user.image || null
                }
            });
        }

        // Create asset
        const asset = await prisma.asset.create({
            data: {
                userId: user.id,
                ticker: ticker.toUpperCase(),
                name,
                quantity: parseFloat(quantity),
                averagePrice: parseFloat(averagePrice),
                type
            }
        });

        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        console.error('Error creating asset:', error);
        return NextResponse.json({ error: 'Erro ao criar ativo' }, { status: 500 });
    }
}

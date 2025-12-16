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
        console.log('[API] POST /api/assets - Starting asset creation');
        const session = await auth();

        console.log('[API] Session:', {
            hasSession: !!session,
            hasUser: !!session?.user,
            email: session?.user?.email
        });

        if (!session?.user?.email) {
            console.error('[API] Unauthorized: No session or email');
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await request.json();
        console.log('[API] Request body:', body);

        const { ticker, name, quantity, averagePrice, type } = body;

        // Validate required fields
        if (!ticker || !name || !quantity || !averagePrice || !type) {
            console.error('[API] Missing required fields:', { ticker, name, quantity, averagePrice, type });
            return NextResponse.json(
                { error: 'Campos obrigatórios faltando' },
                { status: 400 }
            );
        }

        // Validate numeric values
        const parsedQuantity = parseFloat(quantity);
        const parsedPrice = parseFloat(averagePrice);

        if (isNaN(parsedQuantity) || isNaN(parsedPrice) || parsedQuantity <= 0 || parsedPrice <= 0) {
            console.error('[API] Invalid numeric values:', { quantity, averagePrice, parsedQuantity, parsedPrice });
            return NextResponse.json(
                { error: 'Quantidade e preço devem ser números positivos' },
                { status: 400 }
            );
        }

        // Find or create user
        console.log('[API] Looking for user:', session.user.email);
        let user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            console.log('[API] User not found, creating new user');
            user = await prisma.user.create({
                data: {
                    email: session.user.email,
                    name: session.user.name || null,
                    image: session.user.image || null
                }
            });
            console.log('[API] User created:', user.id);
        } else {
            console.log('[API] User found:', user.id);
        }

        // Create asset
        console.log('[API] Creating asset for user:', user.id);
        const asset = await prisma.asset.create({
            data: {
                userId: user.id,
                ticker: ticker.toUpperCase(),
                name,
                quantity: parsedQuantity,
                averagePrice: parsedPrice,
                type
            }
        });

        console.log('[API] Asset created successfully:', asset.id);
        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        console.error('[API] Error creating asset:', error);
        console.error('[API] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json({
            error: 'Erro ao criar ativo',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

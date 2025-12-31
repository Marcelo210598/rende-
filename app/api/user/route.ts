import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Dev mode storage for user profiles
const globalForDevUsers = global as unknown as {
    devUsers: Map<string, any>
};
const devUsers = globalForDevUsers.devUsers || new Map();
if (!globalForDevUsers.devUsers) {
    globalForDevUsers.devUsers = devUsers;
}

const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.USE_DATABASE;

// GET /api/user - Get current user profile
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (isDevelopmentMode) {
            // Dev mode: use in-memory storage
            let user = devUsers.get(session.user.email);

            if (!user) {
                user = {
                    id: `dev-${session.user.email}`,
                    email: session.user.email,
                    name: session.user.name || null,
                    image: session.user.image || null,
                    monthlyIncome: 0,
                    discreteMode: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                devUsers.set(session.user.email, user);
            }

            return NextResponse.json(user);
        }

        let user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        // Create user if doesn't exist
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: session.user.email,
                    name: session.user.name || null,
                    image: session.user.image || null,
                    monthlyIncome: 0,
                    discreteMode: false,
                },
            });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/user - Update user profile
export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, image, monthlyIncome, discreteMode } = body;

        if (isDevelopmentMode) {
            // Dev mode: update in-memory storage
            let user = devUsers.get(session.user.email);

            if (!user) {
                user = {
                    id: `dev-${session.user.email}`,
                    email: session.user.email,
                    name: null,
                    image: null,
                    monthlyIncome: 0,
                    discreteMode: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            }

            // Update fields
            if (name !== undefined) user.name = name;
            if (image !== undefined) user.image = image;
            if (monthlyIncome !== undefined) user.monthlyIncome = parseFloat(monthlyIncome) || 0;
            if (discreteMode !== undefined) user.discreteMode = discreteMode;
            user.updatedAt = new Date();

            devUsers.set(session.user.email, user);
            console.log('✅ Perfil atualizado (DEV MODE):', user);

            return NextResponse.json(user);
        }

        const user = await prisma.user.upsert({
            where: { email: session.user.email },
            update: {
                ...(name !== undefined && { name }),
                ...(image !== undefined && { image }),
                ...(monthlyIncome !== undefined && { monthlyIncome: parseFloat(monthlyIncome) || 0 }),
                ...(discreteMode !== undefined && { discreteMode }),
            },
            create: {
                email: session.user.email,
                name: name || session.user.name || null,
                image: image || session.user.image || null,
                monthlyIncome: parseFloat(monthlyIncome) || 0,
                discreteMode: discreteMode || false,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

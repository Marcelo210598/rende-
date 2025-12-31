import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { devCodes } from '@/lib/devStorage';

// Forçar modo dev até configurar Resend e fazer db push
const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.USE_DATABASE;

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email e código são obrigatórios' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedCode = code.trim();

        let userId: string;

        if (isDevelopmentMode) {
            // Modo desenvolvimento sem banco de dados
            const storedData = devCodes.get(normalizedEmail);

            if (!storedData) {
                return NextResponse.json(
                    { error: 'Código inválido' },
                    { status: 400 }
                );
            }

            if (new Date() > storedData.expiresAt) {
                devCodes.delete(normalizedEmail);
                return NextResponse.json(
                    { error: 'Código expirado. Solicite um novo código.' },
                    { status: 400 }
                );
            }

            if (storedData.code !== normalizedCode) {
                return NextResponse.json(
                    { error: 'Código inválido' },
                    { status: 400 }
                );
            }

            // Código válido!
            devCodes.delete(normalizedEmail);
            userId = `dev-${normalizedEmail}`;

            console.log(`✅ Login bem-sucedido: ${normalizedEmail}`);
        } else {
            // Modo produção com banco de dados
            const verificationCode = await prisma.verificationCode.findFirst({
                where: {
                    email: normalizedEmail,
                    code: normalizedCode,
                }
            });

            if (!verificationCode) {
                return NextResponse.json(
                    { error: 'Código inválido' },
                    { status: 400 }
                );
            }

            if (new Date() > verificationCode.expiresAt) {
                await prisma.verificationCode.delete({
                    where: { id: verificationCode.id }
                });

                return NextResponse.json(
                    { error: 'Código expirado. Solicite um novo código.' },
                    { status: 400 }
                );
            }

            let user = await prisma.user.findUnique({
                where: { email: normalizedEmail }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: normalizedEmail,
                        emailVerified: new Date(),
                    }
                });
            } else if (!user.emailVerified) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { emailVerified: new Date() }
                });
            }

            await prisma.verificationCode.delete({
                where: { id: verificationCode.id }
            });

            userId = user.id;
        }

        // Retornar dados do usuário para NextAuth
        return NextResponse.json({
            success: true,
            user: {
                id: userId,
                email: normalizedEmail,
                name: null,
                image: null,
            }
        });

    } catch (error) {
        console.error('Erro ao verificar código:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

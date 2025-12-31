import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { devCodes } from "@/lib/devStorage"

// Forçar modo dev até configurar Resend e fazer db push
const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.USE_DATABASE;

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            id: "email-otp",
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                code: { label: "Code", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.code) {
                    return null;
                }

                const normalizedEmail = (credentials.email as string).toLowerCase().trim();
                const normalizedCode = (credentials.code as string).trim();

                if (isDevelopmentMode) {
                    // Modo desenvolvimento sem banco
                    console.log(`🔍 DEV MODE: Tentando validar código para ${normalizedEmail}`);
                    console.log(`🔍 Código recebido: ${normalizedCode}`);

                    const storedData = devCodes.get(normalizedEmail);
                    console.log(`🔍 Dados armazenados:`, storedData);

                    if (!storedData) {
                        console.log('❌ Nenhum código encontrado para este email');
                        return null;
                    }

                    if (new Date() > storedData.expiresAt) {
                        console.log('❌ Código expirado');
                        devCodes.delete(normalizedEmail);
                        return null;
                    }

                    if (storedData.code !== normalizedCode) {
                        console.log(`❌ Código incorreto. Esperado: ${storedData.code}, Recebido: ${normalizedCode}`);
                        return null;
                    }

                    devCodes.delete(normalizedEmail);
                    console.log('✅ Código validado com sucesso!');

                    return {
                        id: `dev-${normalizedEmail}`,
                        email: normalizedEmail,
                        name: null,
                        image: null
                    };
                }

                // Modo produção com banco
                const verificationCode = await prisma.verificationCode.findFirst({
                    where: {
                        email: normalizedEmail,
                        code: normalizedCode,
                    }
                });

                if (!verificationCode || new Date() > verificationCode.expiresAt) {
                    if (verificationCode) {
                        await prisma.verificationCode.delete({
                            where: { id: verificationCode.id }
                        });
                    }
                    return null;
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

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image
                };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production'
                ? `__Secure-next-auth.session-token`
                : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            }
        }
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = (token.sub || '') as string;
                if (token.name) session.user.name = token.name as string;
                if (token.email) session.user.email = token.email as string;
                if (token.picture) session.user.image = token.picture as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },
    pages: {
        signIn: '/login',
    }
})

export const { GET, POST } = handlers

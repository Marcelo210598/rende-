import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Credentials provider for development/testing
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // ONLY for development - accept test credentials
                if (process.env.NODE_ENV === 'development') {
                    if (credentials?.email === "test@test.com" && credentials?.password === "test123") {
                        return {
                            id: "dev-user-1",
                            email: "test@test.com",
                            name: "Usuário Teste",
                            image: null
                        }
                    }
                }
                return null
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

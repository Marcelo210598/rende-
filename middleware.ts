import { auth } from "@/app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const protectedRoutes = [
    '/dashboard',
    '/carteira',
    '/adicionar-ativo',
    '/perfil',
    '/conhecimento'
]

// Define public routes
const publicRoutes = [
    '/',
    '/login',
    '/cadastro',
    '/onboarding',
    '/splash'
]

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

    // Get session
    const session = await auth()

    // If trying to access protected route without session, redirect to login
    if (isProtectedRoute && !session) {
        const url = new URL('/login', request.url)
        return NextResponse.redirect(url)
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (session && pathname === '/login') {
        const url = new URL('/dashboard', request.url)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|.*\\.webp).*)',
    ],
}

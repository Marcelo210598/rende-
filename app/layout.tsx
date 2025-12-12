import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ProfileProvider } from "@/contexts/ProfileContext";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-inter"
});

export const metadata: Metadata = {
    title: "Rende+ | Tudo em um único lugar",
    description: "Plataforma completa de investimentos e educação financeira. Acompanhe ações, FIIs, criptomoedas e renda fixa em um único lugar.",
    keywords: ["investimentos", "ações", "FIIs", "criptomoedas", "renda fixa", "carteira", "educação financeira"],
    authors: [{ name: "Rende+" }],
    creator: "Rende+",
    publisher: "Rende+",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://rendeplus.app",
        title: "Rende+ | Tudo em um único lugar",
        description: "Plataforma completa de investimentos e educação financeira",
        siteName: "Rende+",
    },
    twitter: {
        card: "summary_large_image",
        title: "Rende+ | Tudo em um único lugar",
        description: "Plataforma completa de investimentos e educação financeira",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
    themeColor: "#00D1B2",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className={`${inter.variable} antialiased`}>
                <AuthProvider>
                    <ProfileProvider>
                        {children}
                    </ProfileProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

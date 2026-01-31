import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PrivateModeProvider } from "@/contexts/PrivateModeContext";
import { Toaster } from "sonner";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rende+ | Controle de Gastos Simples",
  description:
    "Seu parceiro diário para controle de gastos domésticos. Simples, rápido e mobile-first. Substitua papel, caneta e Excel.",
  keywords: [
    "controle de gastos",
    "finanças pessoais",
    "orçamento",
    "despesas",
    "dívidas",
    "parcelas",
  ],
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
    title: "Rende+ | Controle de Gastos Simples",
    description: "Seu parceiro diário para controle de gastos domésticos",
    siteName: "Rende+",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rende+ | Controle de Gastos Simples",
    description: "Seu parceiro diário para controle de gastos domésticos",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rende+",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0D14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Rende+" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10B981" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-white`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PrivateModeProvider>
              <ServiceWorkerRegistration />
              {children}
              <Toaster
                position="top-center"
                richColors
                toastOptions={{
                  className: "glass-toast",
                  style: {
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  },
                }}
              />
            </PrivateModeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

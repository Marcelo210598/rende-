import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0A0D14",
                card: {
                    DEFAULT: "rgba(20, 25, 35, 0.8)",
                    border: "rgba(255, 255, 255, 0.08)",
                },
                accent: {
                    green: "#10B981",
                    red: "#EF4444",
                    blue: "#3B82F6",
                    purple: "#8B5CF6",
                    orange: "#F59E0B",
                    pink: "#EC4899",
                },
                text: {
                    primary: "#FFFFFF",
                    secondary: "rgba(255, 255, 255, 0.6)",
                    muted: "rgba(255, 255, 255, 0.4)",
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                "2xl": "16px",
                "3xl": "24px",
            },
            spacing: {
                "safe-bottom": "max(env(safe-area-inset-bottom), 20px)",
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "scale-in": "scaleIn 0.2s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.9)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;

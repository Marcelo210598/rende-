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
                background: "#0B0E17",
                primary: {
                    DEFAULT: "#00D1B2",
                    light: "#00E7C0",
                },
                accent: {
                    red: "#FF4D6D",
                },
                card: {
                    DEFAULT: "rgba(26, 31, 46, 0.7)",
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                "3xl": "24px",
            },
            backdropBlur: {
                lg: "16px",
            },
        },
    },
    plugins: [],
};

export default config;

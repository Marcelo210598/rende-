import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "gradient" | "glass" | "outline";
    className?: string;
}

export default function Button({
    children,
    variant = "gradient",
    className,
    ...props
}: ButtonProps) {
    const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all duration-300 disabled:opacity-50";

    const variants = {
        gradient: "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:shadow-primary/50 hover:scale-105",
        glass: "glass-card hover:bg-card/90",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}

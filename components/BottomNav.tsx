"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Receipt, CreditCard, Target, User } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/gastos", icon: Receipt, label: "Gastos" },
    { href: "/dividas", icon: CreditCard, label: "Dívidas" },
    { href: "/orcamento", icon: Target, label: "Orçamento" },
    { href: "/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            <div className="flex justify-around items-center px-2 pt-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`bottom-nav-item relative ${isActive ? "active" : "inactive"}`}
                        >
                            <div className="relative">
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-green"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </div>
                            <span className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

"use client";

import { Home, Wallet, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Wallet, label: "Carteira", href: "/carteira" },
    { icon: BookOpen, label: "Conhecimento", href: "/conhecimento" },
    { icon: User, label: "Perfil", href: "/perfil" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl border-t border-white/10 z-50">
            <div className="flex justify-around items-center h-20 max-w-md mx-auto px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-1 relative"
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="relative"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -inset-3 bg-gradient-to-r from-primary to-primary-light rounded-2xl opacity-20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon
                                    className={`w-6 h-6 transition-colors relative z-10 ${isActive
                                            ? "text-primary"
                                            : "text-gray-400"
                                        }`}
                                />
                            </motion.div>
                            <span
                                className={`text-xs font-bold transition-colors ${isActive ? "text-primary" : "text-gray-400"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

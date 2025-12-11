"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Moon, Eye, EyeOff, ChevronRight, LogOut } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import BottomNav from "@/components/BottomNav";

export default function PerfilPage() {
    const [discreteMode, setDiscreteMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const menuItems = [
        { icon: User, label: "Dados Pessoais", href: "#" },
        { icon: Shield, label: "Segurança", href: "#" },
        { icon: Bell, label: "Notificações", href: "#", toggle: true, value: notifications, onChange: setNotifications },
        { icon: Moon, label: "Tema Escuro", href: "#", toggle: true, value: true, onChange: () => { } },
    ];

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="p-6 space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold"
                >
                    Perfil
                </motion.h1>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-light/20 border border-primary/30">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-2xl font-bold">
                                JD
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">João da Silva</h2>
                                <p className="text-gray-400">joao.silva@email.com</p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Discrete Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {discreteMode ? (
                                    <EyeOff className="w-5 h-5 text-primary" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                    <h3 className="font-bold">Modo Discreto</h3>
                                    <p className="text-sm text-gray-400">
                                        {discreteMode ? "Valores ocultos" : "Valores visíveis"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDiscreteMode(!discreteMode)}
                                className={`relative w-14 h-8 rounded-full transition-colors ${discreteMode ? "bg-primary" : "bg-gray-600"
                                    }`}
                            >
                                <motion.div
                                    className="absolute top-1 w-6 h-6 bg-white rounded-full"
                                    animate={{ left: discreteMode ? "calc(100% - 28px)" : "4px" }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Menu Items */}
            <div className="px-6 space-y-3">
                <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider">Configurações</h3>
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                        >
                            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-bold">{item.label}</span>
                                    </div>
                                    {item.toggle ? (
                                        <button
                                            onClick={() => item.onChange?.(!item.value)}
                                            className={`relative w-12 h-7 rounded-full transition-colors ${item.value ? "bg-primary" : "bg-gray-600"
                                                }`}
                                        >
                                            <motion.div
                                                className="absolute top-1 w-5 h-5 bg-white rounded-full"
                                                animate={{ left: item.value ? "calc(100% - 24px)" : "4px" }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* Stats */}
            <div className="px-6 mt-6 space-y-3">
                <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider">Estatísticas</h3>
                <GlassCard>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-primary">24</p>
                            <p className="text-xs text-gray-400 mt-1">Ativos</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">6</p>
                            <p className="text-xs text-gray-400 mt-1">Meses</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">+82%</p>
                            <p className="text-xs text-gray-400 mt-1">Retorno</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Logout */}
            <div className="px-6 mt-6">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full glass-card p-4 rounded-2xl flex items-center justify-center gap-2 text-accent-red font-bold hover:bg-accent-red/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sair da Conta
                </motion.button>
            </div>

            <BottomNav />
        </div>
    );
}

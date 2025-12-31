"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Camera, Eye, EyeOff, LogOut, DollarSign, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { usePrivateMode } from "@/contexts/PrivateModeContext";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    monthlyIncome: number;
    discreteMode: boolean;
}

export default function PerfilPage() {
    const { data: session } = useSession();
    const { isPrivateMode, togglePrivateMode } = usePrivateMode();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Edit form
    const [editName, setEditName] = useState("");
    const [editIncome, setEditIncome] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch("/api/user");
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setEditName(data.name || "");
                setEditIncome(data.monthlyIncome?.toString() || "");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName,
                    monthlyIncome: parseFloat(editIncome) || 0,
                }),
            });

            if (!response.ok) throw new Error("Erro ao salvar");

            const updated = await response.json();
            setUser(updated);
            toast.success("Perfil atualizado!");
            setShowEditModal(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar perfil");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    const formatCurrency = (value: number) => {
        if (isPrivateMode) return "R$ ••••,••";
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold">Perfil</h1>
                <p className="text-white/50 text-sm">Gerencie sua conta</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full object-cover ring-2 ring-accent-green/30"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center ring-2 ring-accent-green/30">
                                <UserIcon size={32} className="text-accent-green" />
                            </div>
                        )}
                        <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent-green flex items-center justify-center shadow-lg">
                            <Camera size={16} />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{user?.name || "Usuário"}</h2>
                        <p className="text-sm text-white/50">{user?.email}</p>
                    </div>
                </div>
            </motion.div>

            {/* Settings Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                {/* Monthly Income */}
                <button
                    onClick={() => setShowEditModal(true)}
                    className="glass-card p-4 w-full flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
                        <DollarSign size={24} className="text-accent-green" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-medium">Renda Mensal</p>
                        <p className={`text-sm text-white/50 ${isPrivateMode ? "discrete-blur" : ""}`}>
                            {formatCurrency(user?.monthlyIncome || 0)}
                        </p>
                    </div>
                    <span className="text-sm text-accent-green">Editar</span>
                </button>

                {/* Discrete Mode */}
                <button
                    onClick={togglePrivateMode}
                    className="glass-card p-4 w-full flex items-center gap-4"
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPrivateMode ? "bg-accent-purple/20" : "bg-white/10"
                        }`}>
                        {isPrivateMode ? (
                            <EyeOff size={24} className="text-accent-purple" />
                        ) : (
                            <Eye size={24} className="text-white/60" />
                        )}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-medium">Modo Discreto</p>
                        <p className="text-sm text-white/50">
                            {isPrivateMode ? "Valores ocultos" : "Valores visíveis"}
                        </p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${isPrivateMode ? "bg-accent-purple" : "bg-white/20"
                        }`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mt-0.5 ${isPrivateMode ? "translate-x-6 ml-0.5" : "translate-x-0.5"
                            }`} />
                    </div>
                </button>

                {/* Edit Profile */}
                <button
                    onClick={() => setShowEditModal(true)}
                    className="glass-card p-4 w-full flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center">
                        <UserIcon size={24} className="text-accent-blue" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-medium">Editar Perfil</p>
                        <p className="text-sm text-white/50">Nome e configurações</p>
                    </div>
                    <span className="text-sm text-accent-blue">→</span>
                </button>

                {/* Logout */}
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="glass-card p-4 w-full flex items-center gap-4 border border-accent-red/20"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent-red/10 flex items-center justify-center">
                        <LogOut size={24} className="text-accent-red" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-medium text-accent-red">Sair da Conta</p>
                        <p className="text-sm text-white/50">Fazer logout</p>
                    </div>
                </button>
            </motion.div>

            {/* App Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-white/30 text-sm pt-4"
            >
                <p>Rende+ v1.0</p>
                <p className="text-xs mt-1">Controle de gastos simples e rápido</p>
            </motion.div>

            {/* Edit Profile Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Perfil">
                <div className="space-y-4">
                    <Input
                        label="Nome"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Seu nome"
                    />

                    <Input
                        label="Renda Mensal (R$)"
                        type="number"
                        value={editIncome}
                        onChange={(e) => setEditIncome(e.target.value)}
                        placeholder="0,00"
                    />

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Sair da Conta">
                <div className="space-y-4">
                    <p className="text-white/70">
                        Tem certeza que deseja sair da sua conta?
                    </p>
                    <p className="text-sm text-white/50">
                        Seus dados continuarão salvos e você poderá fazer login novamente a qualquer momento.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowLogoutModal(false)} className="btn-secondary flex-1">
                            Cancelar
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 px-6 py-3 rounded-2xl font-semibold text-white bg-accent-red hover:bg-red-600 flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} />
                            Sair
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

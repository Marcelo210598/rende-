"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Check } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function CadastroPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validação básica
        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        if (formData.password.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres!");
            return;
        }

        // Simular sucesso
        setShowSuccess(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            {/* Back Button */}
            <div className="w-full max-w-md mb-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold">Voltar</span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8"
            >
                {/* Logo */}
                <div className="flex flex-col items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="Rende+"
                        width={180}
                        height={54}
                        priority
                    />
                    <p className="text-gray-400 text-sm">Tudo em um único lugar</p>
                </div>

                {/* Signup Card */}
                <GlassCard className="space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">Crie sua conta</h1>
                        <p className="text-gray-400">Comece a investir com inteligência</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="João da Silva"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Confirmar Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    placeholder="Digite a senha novamente"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3 focus:outline-none focus:border-primary transition-colors"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="text-xs text-gray-400 text-center">
                            Ao criar uma conta, você concorda com nossos{" "}
                            <button type="button" className="text-primary hover:text-primary-light transition-colors">
                                Termos de Uso
                            </button>{" "}
                            e{" "}
                            <button type="button" className="text-primary hover:text-primary-light transition-colors">
                                Política de Privacidade
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">
                            Criar Conta
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-sm">
                        <span className="text-gray-400">Já tem uma conta? </span>
                        <button
                            onClick={() => router.push("/login")}
                            className="text-primary hover:text-primary-light transition-colors font-bold"
                        >
                            Entrar
                        </button>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Success Modal */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <GlassCard className="text-center space-y-4 max-w-sm">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                                <Check className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">Conta Criada!</h2>
                            <p className="text-gray-400">
                                Bem-vindo ao Rende+! Você será redirecionado em instantes.
                            </p>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

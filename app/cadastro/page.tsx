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

                    {/* Google Sign Up */}
                    <button
                        type="button"
                        onClick={() => {
                            // Aqui você integraria com NextAuth ou Firebase
                            alert("Integração com Google em breve!");
                        }}
                        className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Cadastrar com Google
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-gray-400">ou cadastre-se com email</span>
                        </div>
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

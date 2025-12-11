"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
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

                {/* Login Card */}
                <GlassCard className="space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
                        <p className="text-gray-400">Entre para acessar sua carteira</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3 focus:outline-none focus:border-primary transition-colors"
                                    required
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

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button
                                type="button"
                                className="text-sm text-primary hover:text-primary-light transition-colors font-bold"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm">
                        <span className="text-gray-400">Não tem uma conta? </span>
                        <button className="text-primary hover:text-primary-light transition-colors font-bold">
                            Cadastre-se
                        </button>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}

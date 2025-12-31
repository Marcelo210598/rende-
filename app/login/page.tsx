"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type LoginStep = "email" | "code";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [step, setStep] = useState<LoginStep>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [canResend, setCanResend] = useState(true);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    // Cooldown timer for resend
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendCooldown]);

    const handleSendCode = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Por favor, insira um email válido");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Erro ao enviar código");
                return;
            }

            if (data.devMode) {
                toast.success("🔧 Modo Dev: Código no console do servidor!");
            } else {
                toast.success("Código enviado! Confira seu email 📧");
            }

            setExpiresAt(new Date(data.expiresAt));
            setStep("code");
            setCanResend(false);
            setResendCooldown(30);

            // Focus primeiro input
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (error) {
            toast.error("Erro ao enviar código");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Se colar código completo
            const pastedCode = value.slice(0, 6).split("");
            const newCode = [...code];
            pastedCode.forEach((digit, i) => {
                if (i < 6 && /^\d$/.test(digit)) {
                    newCode[i] = digit;
                }
            });
            setCode(newCode);
            inputRefs.current[5]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus próximo input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyCode = async () => {
        const fullCode = code.join("");

        if (fullCode.length !== 6) {
            toast.error("Digite o código completo");
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn("email-otp", {
                email,
                code: fullCode,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Código inválido ou expirado");
                setCode(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
                return;
            }

            toast.success("Login realizado com sucesso! 🎉");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Erro ao verificar código");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = () => {
        if (!canResend || resendCooldown > 0) return;
        setCode(["", "", "", "", "", ""]);
        handleSendCode();
    };

    const handleBackToEmail = () => {
        setStep("email");
        setCode(["", "", "", "", "", ""]);
        setExpiresAt(null);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 safe-top safe-bottom">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm text-center"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-green to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-accent-green/30">
                        <span className="text-5xl">💰</span>
                    </div>
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-2">Rende+</h1>
                <p className="text-white/60 mb-8">
                    Controle de gastos simples e rápido.
                    <br />
                    Seu parceiro diário para finanças.
                </p>

                <AnimatePresence mode="wait">
                    {step === "email" ? (
                        <motion.div
                            key="email-step"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* Features */}
                            <div className="glass-card p-4 mb-8">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>✅</span>
                                        <span className="text-white/70">Gastos rápidos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📊</span>
                                        <span className="text-white/70">Gráficos claros</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>💳</span>
                                        <span className="text-white/70">Dívidas e parcelas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>🎯</span>
                                        <span className="text-white/70">Orçamento mensal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                                    placeholder="Seu email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-green"
                                    autoFocus
                                />

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSendCode}
                                    disabled={isLoading}
                                    className="w-full bg-accent-green text-gray-900 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 mx-auto border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                                    ) : (
                                        "Enviar Código"
                                    )}
                                </motion.button>
                            </div>

                            <p className="text-xs text-white/40 mt-4">
                                📧 Enviaremos um código de 6 dígitos para seu email
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="code-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Back Button */}
                            <button
                                onClick={handleBackToEmail}
                                className="text-white/60 hover:text-white text-sm flex items-center gap-2 mb-4"
                            >
                                ← Voltar
                            </button>

                            <p className="text-white/70 mb-6">
                                Digite o código enviado para:
                                <br />
                                <strong className="text-accent-green">{email}</strong>
                            </p>

                            {/* Code Input */}
                            <div className="flex gap-2 justify-center mb-6">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-accent-green"
                                    />
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleVerifyCode}
                                disabled={isLoading}
                                className="w-full bg-accent-green text-gray-900 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 mx-auto border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                                ) : (
                                    "Verificar e Entrar"
                                )}
                            </motion.button>

                            {/* Resend Code */}
                            <div className="text-center">
                                <button
                                    onClick={handleResendCode}
                                    disabled={!canResend || resendCooldown > 0}
                                    className="text-sm text-white/60 hover:text-accent-green disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendCooldown > 0
                                        ? `Reenviar código em ${resendCooldown}s`
                                        : "Reenviar código"}
                                </button>
                            </div>

                            <p className="text-xs text-white/40 mt-4">
                                ⏱️ Código expira em 5 minutos
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-xs text-white/40 mt-8">
                    Seus dados ficam salvos e seguros na nuvem
                </p>
            </motion.div>
        </div>
    );
}

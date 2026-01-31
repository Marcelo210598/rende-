"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, TrendingUp, Target, ArrowRight, ArrowLeft, Check, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface OnboardingData {
  monthlyIncome: string;
  hasBudget: boolean;
  firstCategory?: string;
}

const CATEGORIES = [
  { id: "alimentacao", name: "Alimentação", emoji: "🍔" },
  { id: "transporte", name: "Transporte", emoji: "🚗" },
  { id: "moradia", name: "Casa", emoji: "🏠" },
  { id: "lazer", name: "Lazer", emoji: "🎮" },
  { id: "saude", name: "Saúde", emoji: "🏥" },
  { id: "educacao", name: "Educação", emoji: "📚" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    monthlyIncome: "",
    hasBudget: false,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user already completed onboarding
  useEffect(() => {
    const hasOnboarded = localStorage.getItem("onboardingCompleted");
    if (hasOnboarded === "true" && session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleIncomeSubmit = async () => {
    if (!data.monthlyIncome || parseFloat(data.monthlyIncome) <= 0) {
      toast.error("Por favor, insira sua renda mensal");
      return;
    }

    setIsSaving(true);
    try {
      // Update user's monthly income
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyIncome: parseFloat(data.monthlyIncome),
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar renda");

      toast.success("Renda salva! Vamos configurar seus gastos.");
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar renda. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("onboardingCompleted", "true");

      if (selectedCategory) {
        // Create first expense
        await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: "default", // Will create default category if needed
            amount: 0, // Just for setup
            note: "Primeira categoria: " + selectedCategory,
            date: new Date().toISOString(),
          }),
        });
      }

      toast.success("Configuração completa! 🎉");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao completar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: "33.33%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Back Button (steps 2+) */}
      {step > 1 && (
        <button
          onClick={() => setStep(step - 1)}
          className="fixed top-6 left-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-50"
        >
          <ArrowLeft size={20} className="text-white/60" />
        </button>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Income Setup */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mb-6"
                >
                  <span className="text-4xl">💰</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Vamos configurar sua conta!
                </h1>
                <p className="text-white/60 text-lg">
                  Primeiro, qual sua renda mensal?
                </p>
              </div>

              <div className="glass-card p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-3">
                    Renda Mensal (R$)
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={data.monthlyIncome}
                    onChange={(e) => setData({ ...data, monthlyIncome: e.target.value })}
                    placeholder="5.000,00"
                    className="input-field text-3xl font-bold text-center py-6"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleIncomeSubmit}
                  disabled={isSaving || !data.monthlyIncome}
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Continuar
                      <ChevronRight size={20} />
                    </div>
                  )}
                </button>

                {data.monthlyIncome && (
                  <div className="bg-emerald-500/10 rounded-xl p-4 text-center">
                    <p className="text-emerald-400 font-semibold mb-1">
                      Com base nisso, você pode gastar até
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {parseFloat(data.monthlyIncome) * 0.7}{" "}
                      <span className="text-lg text-white/60">/mês</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/40">
                  Passo 1 de 3
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: First Category */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mb-6"
                >
                  <DollarSign size={40} className="text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Vamos registrar seu primeiro gasto!
                </h1>
                <p className="text-white/60">
                  Escolha uma categoria para começar
                </p>
              </div>

              <div className="glass-card p-6">
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-4 rounded-xl transition-all duration-200 text-center ${
                        selectedCategory === cat.name
                          ? "bg-emerald-500/20 ring-2 ring-emerald-500 scale-105"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-3xl block mb-2">{cat.emoji}</span>
                      <span className="text-sm text-white/70">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCompleteOnboarding}
                disabled={isSaving || !selectedCategory}
                className="w-full btn-primary py-4 mt-6 text-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Configurando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Concluir Configuração
                    <Check size={20} />
                  </div>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/40">
                  Passo 2 de 3
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Celebration */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md text-center"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                className="mb-8"
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <span className="text-6xl">🎉</span>
                </div>
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-4">
                Parabéns!
              </h1>
              <p className="text-white/60 text-xl mb-8">
                Configuração completa!
              </p>

              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-4 bg-emerald-500/10 rounded-xl p-4">
                  <Target size={32} className="text-emerald-400" />
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold">
                      Agora veja onde seu dinheiro está indo...
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                >
                  Ver meu Dashboard
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/40">
                  Passo 3 de 3 • Completo!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

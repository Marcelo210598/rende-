"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  Target, 
  Shield, 
  Smartphone,
  Check,
  ArrowRight,
  Star
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Acompanhe seus gastos",
    description: "Registre despesas em segundos e veja para onde seu dinheiro está indo",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: PieChart,
    title: "Gráficos intuitivos",
    description: "Visualize seus gastos por categoria com gráficos bonitos e fáceis de entender",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: CreditCard,
    title: "Controle de dívidas",
    description: "Gerencie parcelas e dívidas, nunca mais perca um vencimento",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Target,
    title: "Metas de economia",
    description: "Defina objetivos financeiros e acompanhe seu progresso",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: Shield,
    title: "Modo discreto",
    description: "Oculte seus valores quando quiser privacidade",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    description: "Funciona perfeitamente no celular, como um app nativo",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
];

const testimonials = [
  {
    name: "Maria Silva",
    role: "Empreendedora",
    content: "Finalmente consegui organizar minhas finanças! O app é muito fácil de usar.",
    avatar: "👩‍💼",
  },
  {
    name: "João Santos",
    role: "Desenvolvedor",
    content: "Simples, direto e funciona. Exatamente o que eu precisava.",
    avatar: "👨‍💻",
  },
  {
    name: "Ana Costa",
    role: "Designer",
    content: "A interface é linda e o modo discreto é perfeito para usar em público.",
    avatar: "👩‍🎨",
  },
];

const pricingPlans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    description: "Perfeito para começar",
    features: [
      "Até 50 gastos por mês",
      "1 conta/carteira",
      "Dashboard básico",
      "Gráficos de categoria",
      "Modo discreto",
    ],
    cta: "Começar Grátis",
    highlighted: false,
  },
  {
    name: "Plus",
    price: "R$ 9,90",
    period: "/mês",
    description: "Para quem leva a sério",
    features: [
      "Gastos ilimitados",
      "Múltiplas contas",
      "Exportar PDF/Excel",
      "Insights com IA",
      "Metas de economia",
      "Suporte prioritário",
    ],
    cta: "Assinar Plus",
    highlighted: true,
  },
  {
    name: "Família",
    price: "R$ 19,90",
    period: "/mês",
    description: "Finanças em conjunto",
    features: [
      "Tudo do Plus",
      "Até 4 membros",
      "Metas compartilhadas",
      "Relatórios familiares",
      "Controle de mesada",
    ],
    cta: "Assinar Família",
    highlighted: false,
  },
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0D14]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0D14]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <span className="text-xl font-bold text-white">Rende+</span>
          </div>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium mb-6">
              ✨ Controle financeiro simplificado
            </span>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Suas finanças no bolso,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                simples assim
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Esqueça planilhas complicadas. O Rende+ é o jeito mais fácil de controlar gastos, 
              dívidas e atingir suas metas financeiras.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:-translate-y-1"
              >
                Começar Grátis
                <ArrowRight size={20} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
              >
                Ver recursos
              </a>
            </div>

            <p className="mt-6 text-sm text-white/40">
              ✅ Sem cartão de crédito • ✅ Grátis para sempre • ✅ Seus dados seguros
            </p>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-4 border border-white/10 max-w-sm mx-auto">
              <div className="bg-[#0A0D14] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-sm">Saldo do mês</p>
                    <p className="text-2xl font-bold text-emerald-400">R$ 2.450,00</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-emerald-400" size={24} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/50 text-xs">Receita</p>
                    <p className="text-white font-semibold">R$ 5.000</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/50 text-xs">Gastos</p>
                    <p className="text-red-400 font-semibold">R$ 2.550</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                    <span className="text-xl">🍔</span>
                    <div className="flex-1">
                      <p className="text-white text-sm">Alimentação</p>
                      <p className="text-white/50 text-xs">Hoje, 12:30</p>
                    </div>
                    <p className="text-red-400 font-medium">-R$ 45</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                    <span className="text-xl">🚗</span>
                    <div className="flex-1">
                      <p className="text-white text-sm">Uber</p>
                      <p className="text-white/50 text-xs">Hoje, 09:15</p>
                    </div>
                    <p className="text-red-400 font-medium">-R$ 28</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tudo que você precisa para{" "}
              <span className="text-emerald-400">organizar suas finanças</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Funcionalidades pensadas para simplificar sua vida financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={feature.color} size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-white/60">Milhares de pessoas já organizaram suas finanças</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{testimonial.avatar}</span>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-white/50 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Planos para todos os bolsos
            </h2>
            <p className="text-white/60">Comece grátis e faça upgrade quando precisar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-6 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border-2 border-emerald-500/50 relative"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    MAIS POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/50">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/80">
                      <Check size={16} className="text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl p-10 border border-emerald-500/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para organizar suas finanças?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram sua relação com o dinheiro
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-colors"
            >
              Criar Conta Grátis
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
            <span className="font-semibold text-white">Rende+</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2026 Rende+. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Shield, Lightbulb, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import BottomNav from "@/components/BottomNav";

const categories = [
    { icon: TrendingUp, title: "Investimentos", color: "from-primary to-primary-light", articles: 12 },
    { icon: Shield, title: "Segurança", color: "from-primary-light to-primary", articles: 8 },
    { icon: Lightbulb, title: "Dicas", color: "from-accent-red to-primary", articles: 15 },
];

const articles = [
    {
        title: "Como diversificar sua carteira",
        description: "Aprenda as melhores estratégias para reduzir riscos e maximizar ganhos.",
        readTime: "5 min",
        category: "Investimentos",
    },
    {
        title: "Entendendo dividendos",
        description: "Saiba como funcionam os proventos e como escolher boas pagadoras.",
        readTime: "7 min",
        category: "Investimentos",
    },
    {
        title: "Proteção de dados financeiros",
        description: "Mantenha suas informações seguras com estas práticas essenciais.",
        readTime: "4 min",
        category: "Segurança",
    },
    {
        title: "Análise fundamentalista básica",
        description: "Aprenda a avaliar empresas antes de investir em suas ações.",
        readTime: "10 min",
        category: "Dicas",
    },
];

export default function ConhecimentoPage() {
    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="p-6 space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold"
                >
                    Conhecimento 📚
                </motion.h1>
                <p className="text-gray-400">Aprenda a investir melhor</p>
            </div>

            <div className="px-6 space-y-6">
                {/* Categories */}
                <div className="grid grid-cols-3 gap-3">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="text-center space-y-2 hover:scale-105 transition-transform cursor-pointer">
                                    <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-bold">{category.title}</p>
                                    <p className="text-xs text-gray-400">{category.articles} artigos</p>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Featured Article */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-light/20 border border-primary/30 cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-primary">DESTAQUE</span>
                                    <span className="text-xs text-gray-400">• 12 min</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Guia completo para iniciantes</h3>
                                <p className="text-sm text-gray-400 mb-3">
                                    Tudo que você precisa saber para começar a investir com segurança e inteligência.
                                </p>
                                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                    <span>Ler agora</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Articles List */}
                <div className="space-y-3">
                    <h3 className="font-bold">Artigos Recentes</h3>
                    {articles.map((article, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <GlassCard className="hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-primary">{article.category}</span>
                                            <span className="text-xs text-gray-400">• {article.readTime}</span>
                                        </div>
                                        <h4 className="font-bold mb-1">{article.title}</h4>
                                        <p className="text-sm text-gray-400">{article.description}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Tips */}
                <GlassCard className="bg-gradient-to-br from-accent-red/20 to-primary/20 border border-accent-red/30">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-red/30 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-5 h-5 text-accent-red" />
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">Dica do Dia</h4>
                            <p className="text-sm text-gray-300">
                                Nunca invista todo seu capital em um único ativo. A diversificação é fundamental para reduzir riscos!
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <BottomNav />
        </div>
    );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { articlesData } from "@/lib/articlesData";

export default function ArticlePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const article = articlesData.find((a) => a.slug === slug);

    if (!article) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <GlassCard className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
                    <button
                        onClick={() => router.push("/conhecimento")}
                        className="text-primary font-bold"
                    >
                        Voltar para Conhecimento
                    </button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header with Back Button */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-white/10 p-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold">Voltar</span>
                </button>
            </div>

            {/* Article Content */}
            <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
                {/* Title and Meta */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3 text-sm">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-1 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                        {article.title}
                    </h1>

                    <p className="text-lg text-gray-300">{article.description}</p>
                </motion.div>

                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="bg-gradient-to-br from-primary/10 to-primary-light/10 border-primary/20">
                        <div className="flex gap-3">
                            <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <p className="text-gray-200 leading-relaxed">{article.content.intro}</p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Sections */}
                <div className="space-y-6">
                    {article.content.sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <GlassCard>
                                <h2 className="text-2xl font-bold mb-4 text-white">
                                    {section.heading}
                                </h2>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    {section.content}
                                </p>
                                {section.list && section.list.length > 0 && (
                                    <ul className="space-y-2 mt-4">
                                        {section.list.map((item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3 text-gray-300"
                                            >
                                                <span className="text-primary font-bold mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Box */}
                {article.content.summary && article.content.summary.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <GlassCard className="bg-gradient-to-br from-accent-red/20 to-primary/20 border-accent-red/30">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-2xl">📌</span>
                                Resumo do Artigo
                            </h3>
                            <ul className="space-y-3">
                                {article.content.summary.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-accent-red font-bold mt-1">✓</span>
                                        <span className="text-gray-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Back to List Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-6"
                >
                    <button
                        onClick={() => router.push("/conhecimento")}
                        className="w-full py-4 rounded-3xl bg-gradient-to-r from-primary to-primary-light font-bold text-white hover:scale-[1.02] transition-transform"
                    >
                        Ver Mais Artigos
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

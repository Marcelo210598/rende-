"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { TrendingUp, Shield, BookOpen, Zap } from "lucide-react";
import Button from "@/components/ui/Button";

const slides = [
    {
        icon: TrendingUp,
        title: "Acompanhe seus investimentos",
        description: "Visualize toda sua carteira em tempo real, com gráficos detalhados e análises completas.",
        gradient: "from-primary to-primary-light",
    },
    {
        icon: Shield,
        title: "Segurança em primeiro lugar",
        description: "Seus dados protegidos com criptografia de ponta e modo discreto para privacidade total.",
        gradient: "from-primary-light to-primary",
    },
    {
        icon: BookOpen,
        title: "Aprenda a investir",
        description: "Acesse conteúdos educativos e dicas de especialistas para tomar melhores decisões.",
        gradient: "from-primary to-accent-red",
    },
    {
        icon: Zap,
        title: "Tudo em um único lugar",
        description: "Gerencie ações, FIIs, criptomoedas e renda fixa em uma única plataforma moderna.",
        gradient: "from-accent-red to-primary-light",
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    const handleNext = () => {
        if (selectedIndex < slides.length - 1) {
            scrollTo(selectedIndex + 1);
        } else {
            // Mark onboarding as completed
            localStorage.setItem('onboardingCompleted', 'true');
            router.push("/login");
        }
    };

    const handleSkip = () => {
        // Mark onboarding as completed even when skipped
        localStorage.setItem('onboardingCompleted', 'true');
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Skip button */}
            <div className="p-6 flex justify-end">
                <button
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-white transition-colors font-bold"
                >
                    Pular
                </button>
            </div>

            {/* Carousel */}
            <div className="flex-1 flex flex-col justify-center px-6">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {slides.map((slide, index) => {
                            const Icon = slide.icon;
                            return (
                                <div key={index} className="flex-[0_0_100%] min-w-0">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex flex-col items-center text-center gap-8"
                                    >
                                        <div
                                            className={`w-32 h-32 rounded-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center`}
                                        >
                                            <Icon className="w-16 h-16 text-white" />
                                        </div>
                                        <div className="space-y-4 max-w-md">
                                            <h2 className="text-3xl font-bold">{slide.title}</h2>
                                            <p className="text-gray-400 text-lg leading-relaxed">
                                                {slide.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className="relative"
                        >
                            <div
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                    ? "bg-primary w-8"
                                    : "bg-gray-600"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Next button */}
            <div className="p-6">
                <Button onClick={handleNext} className="w-full">
                    {selectedIndex === slides.length - 1 ? "Começar" : "Próximo"}
                </Button>
            </div>
        </div>
    );
}

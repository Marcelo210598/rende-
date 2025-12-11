"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function SplashPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/onboarding");
        }, 2500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0, 0.71, 0.2, 1.01],
                }}
                className="flex flex-col items-center gap-4"
            >
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        src="/logo.svg"
                        alt="Rende+"
                        width={200}
                        height={60}
                        priority
                    />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-gray-400 text-sm font-bold"
                >
                    Tudo em um único lugar
                </motion.p>
            </motion.div>
        </div>
    );
}

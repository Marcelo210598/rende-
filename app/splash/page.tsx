"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function SplashPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const timer = setTimeout(() => {
            // Check if user is authenticated
            if (status === "loading") return;

            if (session) {
                // User is logged in, check onboarding status
                const onboardingCompleted = localStorage.getItem('onboardingCompleted');
                if (onboardingCompleted === 'true') {
                    router.push("/dashboard");
                } else {
                    router.push("/onboarding");
                }
            } else {
                // User is not logged in, show onboarding
                const onboardingCompleted = localStorage.getItem('onboardingCompleted');
                if (onboardingCompleted === 'true') {
                    router.push("/login");
                } else {
                    router.push("/onboarding");
                }
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [router, session, status]);

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

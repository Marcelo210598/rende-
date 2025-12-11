"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <motion.div
                className="space-y-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-light"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <p className="text-gray-400 font-bold">Carregando...</p>
            </motion.div>
        </div>
    );
}

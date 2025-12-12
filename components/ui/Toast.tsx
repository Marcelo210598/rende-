"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -50, x: 0 }}
                    className="fixed top-6 right-6 z-50 max-w-md"
                >
                    <div
                        className={`glass-card p-4 rounded-2xl flex items-center gap-3 shadow-lg ${type === "success"
                                ? "border border-primary/30 bg-primary/10"
                                : "border border-accent-red/30 bg-accent-red/10"
                            }`}
                    >
                        {type === "success" ? (
                            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                        ) : (
                            <XCircle className="w-6 h-6 text-accent-red flex-shrink-0" />
                        )}
                        <p className="flex-1 font-bold">{message}</p>
                        <button
                            onClick={onClose}
                            className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

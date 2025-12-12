"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import Button from "./ui/Button";

interface DeleteAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    assetName: string;
}

export default function DeleteAssetModal({ isOpen, onClose, onConfirm, assetName }: DeleteAssetModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-sm"
                        >
                            <GlassCard className="text-center space-y-6">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-full bg-accent-red/20 flex items-center justify-center mx-auto">
                                    <AlertTriangle className="w-8 h-8 text-accent-red" />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold">Excluir Ativo?</h2>
                                    <p className="text-gray-400">
                                        Tem certeza que deseja excluir <span className="font-bold text-white">{assetName}</span>?
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Esta ação não pode ser desfeita.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        onClick={onClose}
                                        variant="glass"
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={onConfirm}
                                        className="flex-1 bg-accent-red hover:bg-accent-red/80"
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

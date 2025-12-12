"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import Button from "./ui/Button";
import ImageUpload from "./ui/ImageUpload";
import { UserProfile } from "@/contexts/ProfileContext";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: UserProfile | null;
    onSave: (profile: Partial<UserProfile>) => void;
}

export default function EditProfileModal({ isOpen, onClose, currentProfile, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        name: '',
        email: '',
        nickname: '',
        phone: '',
        birthdate: '',
        photo: '',
    });

    useEffect(() => {
        if (currentProfile) {
            setFormData(currentProfile);
        }
    }, [currentProfile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');

        // Format: (XX) XXXXX-XXXX
        if (value.length <= 11) {
            if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                value = `(${value}`;
            }
        }

        setFormData({ ...formData, phone: value });
    };

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
                            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
                        >
                            <GlassCard className="relative">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Editar Perfil</h2>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Photo Upload */}
                                    <div className="flex justify-center">
                                        <ImageUpload
                                            currentImage={formData.photo}
                                            onImageChange={(base64) => setFormData({ ...formData, photo: base64, photoSource: 'upload' })}
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Seu nome completo"
                                        />
                                    </div>

                                    {/* Nickname */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">
                                            Apelido / Nome de Exibição
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nickname || ''}
                                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Como quer ser chamado?"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Será usado na saudação do dashboard
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone || ''}
                                            onChange={handlePhoneChange}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="(00) 00000-0000"
                                            maxLength={15}
                                        />
                                    </div>

                                    {/* Birthdate */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">
                                            Data de Nascimento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birthdate || ''}
                                            onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={onClose}
                                            variant="glass"
                                            className="flex-1"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                        >
                                            Salvar Alterações
                                        </Button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

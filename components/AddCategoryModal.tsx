"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import { toast } from "sonner";

const EMOJI_OPTIONS = [
    "🍕", "🍔", "🍜", "☕", "🍺", "🛒", "🎁", "💊",
    "🏋️", "✈️", "🎬", "🎮", "📱", "💻", "🏥", "🎓",
    "🐕", "🐈", "🌿", "⚡", "💰", "🏦", "📦", "🔧",
    "👔", "👗", "👟", "💄", "💇", "🎨", "📸", "🎵",
];

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: { name: string; emoji: string }) => void;
}

export default function AddCategoryModal({ isOpen, onClose, onSave }: AddCategoryModalProps) {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("📦");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Digite um nome para a categoria");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), emoji }),
            });

            if (!response.ok) throw new Error("Erro ao criar categoria");

            const newCategory = await response.json();
            onSave(newCategory);
            toast.success("Categoria criada com sucesso!");
            setName("");
            setEmoji("📦");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar categoria");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Categoria">
            <div className="space-y-6">
                {/* Name input */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Nome da categoria
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Academia, Pet, Streaming..."
                        className="input-field"
                        maxLength={20}
                    />
                </div>

                {/* Emoji picker */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Escolha um emoji
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                        {EMOJI_OPTIONS.map((e) => (
                            <button
                                key={e}
                                onClick={() => setEmoji(e)}
                                className={`text-2xl p-2 rounded-xl transition-all ${emoji === e
                                        ? "bg-accent-green/20 ring-2 ring-accent-green"
                                        : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="glass-card p-4">
                    <p className="text-sm text-white/50 mb-2">Preview:</p>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{emoji}</span>
                        <span className="font-medium">{name || "Nome da categoria"}</span>
                    </div>
                </div>

                {/* Save button */}
                <button
                    onClick={handleSave}
                    disabled={isLoading || !name.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Salvando..." : "Criar Categoria"}
                </button>
            </div>
        </Modal>
    );
}

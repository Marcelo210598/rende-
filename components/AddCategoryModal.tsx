"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import { toast } from "sonner";

const EMOJI_OPTIONS = [
  "🍕",
  "🍔",
  "🍜",
  "☕",
  "🍺",
  "🛒",
  "🎁",
  "💊",
  "🏋️",
  "✈️",
  "🎬",
  "🎮",
  "📱",
  "💻",
  "🏥",
  "🎓",
  "🐕",
  "🐈",
  "🌿",
  "⚡",
  "💰",
  "🏦",
  "📦",
  "🔧",
  "👔",
  "👗",
  "👟",
  "💄",
  "💇",
  "🎨",
  "📸",
  "🎵",
];

const COLOR_OPTIONS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
  "#A1A1AA",
];

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: {
    name: string;
    emoji: string;
    color?: string;
    parentId?: string;
  }) => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [parentId, setParentId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing categories for parent selector
  useState(() => {
    if (isOpen) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCategories(data);
        })
        .catch((err) => console.error("Error fetching categories", err));
    }
  });

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Digite um nome para a categoria");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: name.trim(),
        emoji,
        color,
        parentId: parentId || undefined,
      };

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao criar categoria");

      const newCategory = await response.json();
      onSave(newCategory);
      toast.success("Categoria criada com sucesso!");
      setName("");
      setEmoji("📦");
      setColor(COLOR_OPTIONS[0]);
      setParentId("");
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
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Nome da categoria
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Academia, Pet, Streaming..."
            className="input-field bg-background text-foreground border-border"
            maxLength={20}
          />
        </div>

        {/* Parent Category (Optional) */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Subcategoria de (Opcional)
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="input-field bg-background text-foreground border-border w-full appearance-none"
          >
            <option value="">Nenhuma (Principal)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Cor
          </label>
          <div className="flex flex-wrap gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c
                    ? "border-white scale-110 shadow-lg"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Emoji picker */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Ícone
          </label>
          <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-1">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl p-2 rounded-xl transition-all ${
                  emoji === e
                    ? "bg-accent/20 ring-2 ring-accent"
                    : "bg-muted/10 hover:bg-muted/20"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div
          className="glass-card p-4 rounded-xl border border-border"
          style={{ borderColor: color }}
        >
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: `${color}33`, color: color }}
            >
              {emoji}
            </div>
            <span className="font-medium text-foreground">
              {name || "Nome da categoria"}
            </span>
            {parentId && (
              <span className="text-xs text-muted-foreground ml-auto">
                Sub de {categories.find((c) => c.id === parentId)?.name}
              </span>
            )}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isLoading || !name.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: color }}
        >
          {isLoading ? "Salvando..." : "Criar Categoria"}
        </button>
      </div>
    </Modal>
  );
}

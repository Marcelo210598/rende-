"use client";

interface CategoryGridProps {
    categories: Array<{
        id: string;
        name: string;
        emoji: string;
        isDefault: boolean;
    }>;
    selectedId?: string;
    onSelect: (id: string) => void;
    onAddCategory?: () => void;
}

export default function CategoryGrid({
    categories,
    selectedId,
    onSelect,
    onAddCategory
}: CategoryGridProps) {
    return (
        <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.id)}
                    className={`category-item ${selectedId === category.id ? "selected" : ""}`}
                >
                    <span className="emoji">{category.emoji}</span>
                    <span className="name">{category.name}</span>
                </button>
            ))}

            {onAddCategory && (
                <button
                    onClick={onAddCategory}
                    className="category-item border-2 border-dashed border-white/20 hover:border-white/40"
                >
                    <span className="emoji">➕</span>
                    <span className="name">Adicionar</span>
                </button>
            )}
        </div>
    );
}

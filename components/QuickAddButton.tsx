"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Sheet from "@/components/ui/Sheet";
import QuickExpenseForm from "@/components/QuickExpenseForm";

export default function QuickAddButton() {
    const [isOpen, setIsOpen] = useState(false);

    const handleSuccess = () => {
        setIsOpen(false);
        // Optionally trigger a refresh
        window.location.reload();
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-gradient-to-r from-accent-green to-emerald-400 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                aria-label="Adicionar gasto rápido"
            >
                <Plus className="w-8 h-8 text-dark-bg" />
            </button>

            {/* Sheet with Quick Form */}
            <Sheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Adicionar Gasto"
            >
                <QuickExpenseForm onSuccess={handleSuccess} />
            </Sheet>
        </>
    );
}

"use client";

import { usePrivateMode } from "@/contexts/PrivateModeContext";
import { Eye, EyeOff } from "lucide-react";
import GlassCard from "./ui/GlassCard";

export default function PrivateModeToggle() {
    const { isPrivate, togglePrivateMode } = usePrivateMode();

    return (
        <GlassCard className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-red to-primary flex items-center justify-center">
                    {isPrivate ? (
                        <EyeOff className="w-5 h-5 text-white" />
                    ) : (
                        <Eye className="w-5 h-5 text-white" />
                    )}
                </div>
                <div>
                    <p className="text-sm font-bold">Modo Discreto</p>
                    <p className="text-xs text-gray-400">
                        {isPrivate ? 'Saldos ocultos' : 'Saldos visíveis'}
                    </p>
                </div>
            </div>

            <button
                onClick={togglePrivateMode}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${isPrivate
                        ? 'bg-gradient-to-r from-accent-red to-primary'
                        : 'bg-gray-700'
                    }`}
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-9' : 'translate-x-1'
                        }`}
                />
            </button>
        </GlassCard>
    );
}

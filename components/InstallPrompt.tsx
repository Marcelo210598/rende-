"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already dismissed
    const dismissed = localStorage.getItem("install-prompt-dismissed");
    const dismissedAt = dismissed ? new Date(dismissed) : null;
    const daysSinceDismissed = dismissedAt
      ? (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not recently dismissed
      if (daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show custom prompt
    if (iOS && !standalone && daysSinceDismissed > 7) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("install-prompt-dismissed", new Date().toISOString());
  };

  // Don't show if already installed
  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-4 shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={18} className="text-white/50" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white mb-1">
                  Instalar Rende+
                </h3>
                <p className="text-sm text-white/60 mb-3">
                  {isIOS
                    ? "Toque em 'Compartilhar' e depois 'Adicionar à Tela de Início'"
                    : "Adicione à tela inicial para acesso rápido"}
                </p>

                {isIOS ? (
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Smartphone size={14} />
                    <span>Toque no ícone</span>
                    <span className="px-1.5 py-0.5 bg-white/10 rounded">⬆️</span>
                    <span>abaixo</span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <Download size={16} />
                    Instalar App
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

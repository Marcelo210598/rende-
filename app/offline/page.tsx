"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0A0D14]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
          <WifiOff size={48} className="text-white/40" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Você está offline
        </h1>

        <p className="text-white/60 mb-8">
          Parece que você perdeu a conexão com a internet. 
          Verifique sua conexão e tente novamente.
        </p>

        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
        >
          <RefreshCw size={20} />
          Tentar novamente
        </button>

        <p className="mt-8 text-sm text-white/30">
          💡 Dica: Adicione o Rende+ à tela inicial para usar offline
        </p>
      </motion.div>
    </div>
  );
}

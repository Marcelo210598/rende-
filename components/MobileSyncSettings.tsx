"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Copy, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function MobileSyncSettings() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const res = await fetch("/api/user/sync-token");
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateToken = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/sync-token", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        toast.success("Novo token gerado!");
      }
    } catch (e) {
      toast.error("Erro ao gerar token");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success("Token copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center">
          <Smartphone size={24} className="text-accent-blue" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Sincronização Android</h3>
          <p className="text-sm text-white/50">
            Conecte o App Leitor de Notificações
          </p>
        </div>
      </div>

      <div className="bg-black/20 p-4 rounded-xl space-y-3">
        <p className="text-sm text-white/70">
          Para ativar a leitura automática de notificações (Nubank, Inter, etc),
          instale o app Android e cole este código:
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-black/40 p-3 rounded-lg font-mono text-sm break-all text-accent-green border border-white/5">
            {token || "Nenhum token gerado"}
          </div>
          <button
            onClick={copyToClipboard}
            disabled={!token}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            title="Copiar"
          >
            {copied ? (
              <Check size={18} className="text-accent-green" />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>

        <button
          onClick={generateToken}
          disabled={isLoading}
          className="text-xs text-white/40 hover:text-white/80 flex items-center gap-1 transition-colors"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          {token ? "Gerar novo token" : "Gerar token"}
        </button>
      </div>
    </div>
  );
}

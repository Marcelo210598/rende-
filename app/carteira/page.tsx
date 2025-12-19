"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import DeleteAssetModal from "@/components/DeleteAssetModal";
import Toast from "@/components/ui/Toast";
import { usePriceUpdates } from "@/hooks/usePriceUpdates";
import { useCurrency } from "@/contexts/CurrencyContext";
import { usePrivateMode } from "@/contexts/PrivateModeContext";

interface Asset {
    id: string;
    ticker: string;
    name: string;
    quantity: number;
    averagePrice: number;
    type: string;
    createdAt: string;
    currentPrice?: number;
    totalValue?: number;
    profitLoss?: number;
    profitLossPercent?: number;
}

const typeLabels: Record<string, string> = {
    acao: "Ações",
    fii: "FIIs",
    cripto: "Criptomoedas",
    renda_fixa: "Renda Fixa"
};

export default function CarteiraPage() {
    const router = useRouter();
    const { formatCurrency } = useCurrency();
    const { isPrivate } = usePrivateMode();
    const [activeTab, setActiveTab] = useState("todos");
    const [dbAssets, setDbAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; asset: Asset | null }>({
        isOpen: false,
        asset: null
    });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Fetch assets on mount
    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            console.log('=== RASTREIO DE LEITURA: CARREGAMENTO DA CARTEIRA ===');
            console.log('[Carteira] Iniciando busca de ativos...');
            console.log('[Carteira] Timestamp:', new Date().toISOString());
            console.log('[Carteira] Ambiente:', process.env.NODE_ENV);
            console.log('[Carteira] Endpoint:', '/api/assets');

            setIsLoading(true);

            const response = await fetch('/api/assets');

            console.log('[Carteira] Status Code da resposta:', response.status);
            console.log('[Carteira] Response OK?', response.ok);

            if (!response.ok) {
                console.error('[Carteira] ❌ ERRO ao carregar ativos');
                console.error('[Carteira] Status:', response.status);
                console.error('[Carteira] Status Text:', response.statusText);
                throw new Error('Erro ao carregar ativos');
            }

            const data = await response.json();

            console.log('[Carteira] ✅ DADOS RETORNADOS DA API:');
            console.log('[Carteira] Tipo de dados:', Array.isArray(data) ? 'Array' : typeof data);
            console.log('[Carteira] Quantidade de ativos:', Array.isArray(data) ? data.length : 'N/A');
            console.log('[Carteira] Dados completos:', data);

            if (Array.isArray(data) && data.length > 0) {
                console.log('[Carteira] Primeiro ativo:', data[0]);
                console.log('[Carteira] Estrutura do ativo:', {
                    id: data[0].id,
                    ticker: data[0].ticker,
                    name: data[0].name,
                    quantity: data[0].quantity,
                    averagePrice: data[0].averagePrice,
                    type: data[0].type,
                    createdAt: data[0].createdAt
                });
            } else if (Array.isArray(data) && data.length === 0) {
                console.log('[Carteira] ⚠️ Array vazio retornado - nenhum ativo encontrado');
            }

            console.log('[Carteira] Atualizando estado com os ativos...');
            setDbAssets(data);
            console.log('[Carteira] Estado atualizado com sucesso!');

        } catch (error) {
            console.error('=== ERRO NO CARREGAMENTO DA CARTEIRA ===');
            console.error('[Carteira] ❌ FALHA ao carregar ativos');
            console.error('[Carteira] Tipo de erro:', error instanceof Error ? error.name : typeof error);
            console.error('[Carteira] Mensagem:', error instanceof Error ? error.message : String(error));
            console.error('[Carteira] Stack trace:', error instanceof Error ? error.stack : 'N/A');
            console.error('[Carteira] Erro completo:', error);
            setToast({ message: "Erro ao carregar ativos", type: "error" });
        } finally {
            setIsLoading(false);
            console.log('[Carteira] Carregamento finalizado (loading = false)');
        }
    };

    const handleDeleteAsset = async () => {
        if (!deleteModal.asset) return;

        try {
            const response = await fetch(`/api/assets/${deleteModal.asset.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir ativo');
            }

            setToast({ message: "Ativo excluído com sucesso!", type: "success" });
            setDeleteModal({ isOpen: false, asset: null });
            fetchAssets(); // Reload assets
        } catch (error) {
            console.error('Error deleting asset:', error);
            setToast({ message: "Erro ao excluir ativo", type: "error" });
        }
    };

    // Integrate price updates
    const { assets, isUpdating, lastUpdate, updatePrices } = usePriceUpdates(dbAssets, true);

    // Filter assets by type
    const filteredAssets = activeTab === "todos"
        ? assets
        : assets.filter((asset: Asset) => asset.type === activeTab);

    // Calculate totals
    const totalInvested = filteredAssets.reduce((sum: number, asset: Asset) => sum + (asset.quantity * asset.averagePrice), 0);
    const totalCurrentValue = filteredAssets.reduce((sum: number, asset: Asset) => sum + (asset.totalValue || (asset.quantity * asset.averagePrice)), 0);
    const assetsCount = filteredAssets.length;

    const tabs = [
        { id: "todos", label: "Todos" },
        { id: "acao", label: "Ações" },
        { id: "fii", label: "FIIs" },
        { id: "cripto", label: "Cripto" },
        { id: "renda_fixa", label: "Renda Fixa" },
    ];

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="p-6 space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold"
                >
                    Minha Carteira
                </motion.h1>
                <p className="text-gray-400">Gerencie seus investimentos</p>
            </div>

            {/* Summary Card */}
            <div className="px-6 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-light/20 border border-primary/30">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-gray-400">Resumo da Carteira</h3>
                                <button
                                    onClick={updatePrices}
                                    disabled={isUpdating}
                                    className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors disabled:opacity-50"
                                    title="Atualizar preços"
                                >
                                    <RefreshCw className={`w-4 h-4 text-primary ${isUpdating ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400">Investido</p>
                                    <p className="text-lg font-bold text-white">
                                        {isPrivate ? '••••••' : formatCurrency(totalInvested)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Atual</p>
                                    <p className="text-lg font-bold text-primary">
                                        {isPrivate ? '••••••' : formatCurrency(totalCurrentValue)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Ativos</p>
                                    <p className="text-lg font-bold text-white">{assetsCount}</p>
                                </div>
                            </div>
                            {totalCurrentValue !== totalInvested && (
                                <div className={`flex items-center gap-2 pt-2 border-t border-white/10 ${totalCurrentValue >= totalInvested ? 'text-primary' : 'text-accent-red'}`}>
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-bold">
                                        {isPrivate ? '••••' : `${totalCurrentValue >= totalInvested ? '+' : ''}${formatCurrency(totalCurrentValue - totalInvested)} (${((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(2)}%)`}
                                    </span>
                                </div>
                            )}
                            {lastUpdate && (
                                <p className="text-xs text-gray-500 text-center pt-1">
                                    Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="px-6 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-primary text-white"
                                : "glass-card hover:bg-white/10"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Assets List */}
            <div className="px-6 space-y-3">
                {isLoading ? (
                    <GlassCard className="text-center py-12">
                        <p className="text-gray-400">Carregando ativos...</p>
                    </GlassCard>
                ) : filteredAssets.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <GlassCard className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">
                                    {activeTab === "todos" ? "Sua carteira está vazia" : `Nenhum ativo em ${typeLabels[activeTab] || activeTab}`}
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    {activeTab === "todos"
                                        ? "Adicione seu primeiro investimento para começar a acompanhar seu patrimônio."
                                        : "Adicione ativos desta categoria para começar."}
                                </p>
                                <Button onClick={() => router.push("/adicionar-ativo")}>
                                    <Plus className="w-5 h-5 mr-2" />
                                    Adicionar Ativo
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : (
                    filteredAssets.map((asset: Asset, index: number) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GlassCard className="hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg">{asset.ticker}</h3>
                                            <span className="text-xs px-2 py-1 rounded-lg bg-primary/20 text-primary">
                                                {typeLabels[asset.type] || asset.type}
                                            </span>
                                            {asset.profitLoss !== undefined && (
                                                <span className={`text-xs px-2 py-1 rounded-lg ${asset.profitLoss >= 0 ? 'bg-primary/20 text-primary' : 'bg-accent-red/20 text-accent-red'}`}>
                                                    {asset.profitLoss >= 0 ? '+' : ''}{asset.profitLossPercent?.toFixed(2)}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">{asset.name}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Quantidade</p>
                                                <p className="font-bold">{asset.quantity}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Preço Médio</p>
                                                <p className="font-bold">{isPrivate ? '••••' : formatCurrency(asset.averagePrice)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Preço Atual</p>
                                                <p className="font-bold text-primary">
                                                    {isPrivate ? '••••' : formatCurrency(asset.currentPrice || asset.averagePrice)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Valor Atual</p>
                                                <p className="font-bold text-primary">
                                                    {isPrivate ? '••••' : formatCurrency(asset.totalValue || (asset.quantity * asset.averagePrice))}
                                                </p>
                                            </div>
                                            {asset.profitLoss !== undefined && (
                                                <div className="col-span-2">
                                                    <p className="text-gray-400">Lucro/Prejuízo</p>
                                                    <p className={`font-bold ${asset.profitLoss >= 0 ? 'text-primary' : 'text-accent-red'}`}>
                                                        {isPrivate ? '••••' : `${asset.profitLoss >= 0 ? '+' : ''}${formatCurrency(asset.profitLoss)}`}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, asset })}
                                            className="w-10 h-10 rounded-xl bg-accent-red/20 hover:bg-accent-red/30 flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5 text-accent-red" />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Asset Button */}
            {dbAssets.length > 0 && (
                <div className="fixed bottom-24 right-6 z-10">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push("/adicionar-ativo")}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/50"
                    >
                        <Plus className="w-6 h-6 text-white" />
                    </motion.button>
                </div>
            )}

            <BottomNav />

            {/* Delete Confirmation Modal */}
            <DeleteAssetModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, asset: null })}
                onConfirm={handleDeleteAsset}
                assetName={deleteModal.asset?.ticker || ""}
            />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={!!toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Target, Trophy, Sparkles, Calendar } from "lucide-react";
import { toast } from "sonner";
import { usePrivateMode } from "@/contexts/PrivateModeContext";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  category: string | null;
  color: string | null;
  icon: string | null;
  isCompleted: boolean;
  createdAt: string;
}

const goalCategories = [
  { id: "emergency", name: "Emergência", emoji: "🆘", color: "#ef4444" },
  { id: "travel", name: "Viagem", emoji: "✈️", color: "#3b82f6" },
  { id: "investment", name: "Investimento", emoji: "📈", color: "#10b981" },
  { id: "purchase", name: "Compra", emoji: "🛒", color: "#8b5cf6" },
  { id: "education", name: "Educação", emoji: "📚", color: "#f59e0b" },
  { id: "health", name: "Saúde", emoji: "🏥", color: "#ec4899" },
  { id: "car", name: "Veículo", emoji: "🚗", color: "#6366f1" },
  { id: "home", name: "Casa", emoji: "🏠", color: "#14b8a6" },
  { id: "other", name: "Outro", emoji: "🎯", color: "#64748b" },
];

export default function MetasPage() {
  const { isPrivateMode } = usePrivateMode();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [deleteGoal, setDeleteGoal] = useState<Goal | null>(null);

  // Add form state
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    category: "other",
  });

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const response = await fetch("/api/goals");
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAddGoal = async () => {
    if (!formData.title || !formData.targetAmount) {
      toast.error("Preencha título e valor da meta");
      return;
    }

    setIsSaving(true);
    try {
      const categoryData = goalCategories.find((c) => c.id === formData.category);
      
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          targetAmount: parseFloat(formData.targetAmount),
          deadline: formData.deadline || null,
          category: formData.category,
          icon: categoryData?.emoji,
          color: categoryData?.color,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar meta");

      const newGoal = await response.json();
      setGoals((prev) => [newGoal, ...prev]);
      toast.success("Meta criada! 🎯");
      setShowAddModal(false);
      setFormData({
        title: "",
        targetAmount: "",
        deadline: "",
        category: "other",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar meta");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedGoal || !depositAmount) {
      toast.error("Informe o valor do depósito");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/goals/${selectedGoal.id}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
        }),
      });

      if (!response.ok) throw new Error("Erro ao depositar");

      const updatedGoal = await response.json();
      setGoals((prev) =>
        prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
      );

      if (updatedGoal.isCompleted) {
        toast.success("🎉 Parabéns! Meta atingida!");
      } else {
        toast.success("Depósito realizado! 💰");
      }

      setShowDepositModal(false);
      setSelectedGoal(null);
      setDepositAmount("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao depositar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!deleteGoal) return;

    try {
      const response = await fetch(`/api/goals/${deleteGoal.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir");

      setGoals((prev) => prev.filter((g) => g.id !== deleteGoal.id));
      toast.success("Meta excluída!");
      setDeleteGoal(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir meta");
    }
  };

  const formatCurrency = (value: number) => {
    if (isPrivateMode) return "R$ ••••";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Stats
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter((g) => g.isCompleted).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Metas de Economia</h1>
          <p className="text-white/50 text-sm">{goals.length} metas • {completedGoals} concluídas</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-3 rounded-xl bg-accent-green/20 text-accent-green hover:bg-accent-green/30 transition-colors"
        >
          <Plus size={24} />
        </button>
      </motion.div>

      {/* Summary */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-white/50 mb-1">Total das Metas</p>
              <p className={`font-bold ${isPrivateMode ? "discrete-blur" : ""}`}>
                {formatCurrency(totalTarget)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Guardado</p>
              <p className={`font-bold text-accent-green ${isPrivateMode ? "discrete-blur" : ""}`}>
                {formatCurrency(totalSaved)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Progresso</p>
              <p className="font-bold text-accent-blue">
                {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Goals List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : goals.length > 0 ? (
          <AnimatePresence>
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const categoryData = goalCategories.find((c) => c.id === goal.category);

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`glass-card overflow-hidden ${
                    goal.isCompleted ? "border border-accent-green/30" : ""
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${goal.color || "#10b981"}20` }}
                        >
                          {goal.icon || "🎯"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{goal.title}</h3>
                            {goal.isCompleted && (
                              <Trophy size={16} className="text-yellow-400" />
                            )}
                          </div>
                          {goal.deadline && (
                            <p className="text-xs text-white/50 flex items-center gap-1">
                              <Calendar size={12} />
                              até {formatDate(goal.deadline)}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteGoal(goal)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Trash2 size={16} className="text-white/40" />
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={isPrivateMode ? "discrete-blur" : ""}>
                          {formatCurrency(goal.currentAmount)}
                        </span>
                        <span className={`text-white/50 ${isPrivateMode ? "discrete-blur" : ""}`}>
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <div className="progress-bar h-3">
                        <motion.div
                          className="progress-bar-fill"
                          style={{
                            backgroundColor: goal.isCompleted ? "#10b981" : (goal.color || "#10b981"),
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className={goal.isCompleted ? "text-accent-green" : "text-white/50"}>
                          {Math.round(progress)}% completo
                        </span>
                        {!goal.isCompleted && (
                          <span className={`text-white/50 ${isPrivateMode ? "discrete-blur" : ""}`}>
                            Faltam {formatCurrency(remaining)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {!goal.isCompleted && (
                      <button
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowDepositModal(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-accent-green/20 text-accent-green font-medium hover:bg-accent-green/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Sparkles size={18} />
                        Depositar
                      </button>
                    )}

                    {goal.isCompleted && (
                      <div className="text-center py-2 text-accent-green font-medium flex items-center justify-center gap-2">
                        <Trophy size={18} />
                        Meta Atingida! 🎉
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="glass-card p-8 text-center">
            <span className="text-4xl mb-3 block">🎯</span>
            <p className="text-white/50">Nenhuma meta criada</p>
            <p className="text-sm text-white/30 mt-1">
              Defina metas de economia para alcançar seus objetivos
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-2 rounded-xl bg-accent-green/20 text-accent-green font-medium hover:bg-accent-green/30 transition-colors"
            >
              Criar primeira meta
            </button>
          </div>
        )}
      </motion.div>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nova Meta">
        <div className="space-y-4">
          <Input
            label="Nome da meta"
            placeholder="Ex: Viagem para Europa, Reserva de emergência..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Input
            label="Valor da meta (R$)"
            type="number"
            placeholder="0,00"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
          />

          <Input
            label="Prazo (opcional)"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-3 gap-2">
              {goalCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-xl transition-colors text-center ${
                    formData.category === cat.id
                      ? "ring-2"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                  style={{
                    backgroundColor: formData.category === cat.id ? `${cat.color}20` : undefined,
                    borderColor: formData.category === cat.id ? cat.color : undefined,
                  }}
                >
                  <span className="text-xl block mb-1">{cat.emoji}</span>
                  <span className="text-xs text-white/70">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddGoal}
            disabled={isSaving}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Criar Meta"}
          </button>
        </div>
      </Modal>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false);
          setSelectedGoal(null);
          setDepositAmount("");
        }}
        title="Depositar na Meta"
      >
        <div className="space-y-4">
          {selectedGoal && (
            <div className="glass-card p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${selectedGoal.color || "#10b981"}20` }}
              >
                {selectedGoal.icon || "🎯"}
              </div>
              <div className="flex-1">
                <p className="font-medium">{selectedGoal.title}</p>
                <p className="text-sm text-white/50">
                  {formatCurrency(selectedGoal.currentAmount)} de {formatCurrency(selectedGoal.targetAmount)}
                </p>
              </div>
            </div>
          )}

          <Input
            label="Valor do depósito (R$)"
            type="number"
            placeholder="0,00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            autoFocus
          />

          <button
            onClick={handleDeposit}
            disabled={isSaving || !depositAmount}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSaving ? "Depositando..." : "Confirmar Depósito"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteGoal} onClose={() => setDeleteGoal(null)} title="Excluir Meta">
        <div className="space-y-4">
          <p className="text-white/70">
            Tem certeza que deseja excluir a meta &ldquo;{deleteGoal?.title}&rdquo;?
          </p>
          {deleteGoal && deleteGoal.currentAmount > 0 && (
            <p className="text-sm text-accent-orange">
              ⚠️ Esta meta tem {formatCurrency(deleteGoal.currentAmount)} guardados.
            </p>
          )}
          <div className="flex gap-3">
            <button onClick={() => setDeleteGoal(null)} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button
              onClick={handleDeleteGoal}
              className="flex-1 px-6 py-3 rounded-2xl font-semibold text-white bg-accent-red hover:bg-red-600"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

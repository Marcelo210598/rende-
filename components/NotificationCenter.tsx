"use client";

import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "DANGER";
  isRead: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications on mount and when opening
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      await fetch("/api/notifications", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
      toast.error("Erro ao marcar como lida");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "DANGER":
        return "🚨";
      case "WARNING":
        return "⚠️";
      case "SUCCESS":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "DANGER":
        return "bg-red-500/10 border-red-500/20";
      case "WARNING":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "SUCCESS":
        return "bg-green-500/10 border-green-500/20";
      default:
        return "bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-accent/10 transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" // Only on mobile
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 md:w-96 max-h-[80vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50"
            >
              <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-card/95 backdrop-blur z-10">
                <h3 className="font-semibold">Notificações</h3>
                <Badge variant="secondary" className="text-xs">
                  {notifications.length} nova{notifications.length !== 1 && "s"}
                </Badge>
              </div>

              <div className="p-2 space-y-2">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Carregando...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-3xl mb-2">💤</p>
                    <p className="text-sm">Tudo tranquilo por aqui!</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getBgColor(notification.type)} relative group transition-all hover:bg-accent/5`}
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl pt-1">
                          {getIcon(notification.type)}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => markAsRead(notification.id, e)}
                          className="p-1 rounded-full hover:bg-background/50 h-fit text-muted-foreground hover:text-foreground opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Marcar como lida"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

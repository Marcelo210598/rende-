import { prisma } from "@/lib/prisma";

export type NotificationType = "INFO" | "WARNING" | "SUCCESS" | "DANGER";

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

export const NotificationService = {
  async create({ userId, title, message, type }: CreateNotificationParams) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  },

  async getUnread(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  async checkBillReminders(userId: string) {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const upcomingInstallments = await prisma.debtInstallment.findMany({
      where: {
        debt: { userId },
        isPaid: false,
        dueDate: {
          gte: today,
          lte: threeDaysFromNow,
        },
      },
      include: {
        debt: true,
      },
    });

    for (const installment of upcomingInstallments) {
      const daysUntilDue = Math.ceil(
        (installment.dueDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      let message = "";
      let title = "Lembrete de Conta";

      if (daysUntilDue === 0) {
        message = `A parcela de ${installment.debt.name} vence hoje! Valor: R$ ${installment.amount.toFixed(2)}`;
        title = "Vence Hoje! 💸";
      } else {
        message = `A parcela de ${installment.debt.name} vence em ${daysUntilDue} dias. Valor: R$ ${installment.amount.toFixed(2)}`;
      }

      // Check if notification already exists for this specific installment and day to avoid spam
      // For simplicity in this iteration, we might just create it.
      // In a real app, we'd check for duplicates created "today".

      await this.create({
        userId,
        title,
        message,
        type: "WARNING",
      });
    }
  },

  async checkBudgetAlerts(userId: string) {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const budgets = await prisma.budget.findMany({
      where: { userId, month, year },
      include: {
        category: true,
      },
    });

    for (const budget of budgets) {
      const expenses = await prisma.expense.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          month,
          year,
        },
        _sum: {
          amount: true,
        },
      });

      const spent = expenses._sum.amount || 0;
      const percentage = (spent / budget.monthlyLimit) * 100;

      if (percentage >= 100) {
        await this.create({
          userId,
          title: "Orçamento Estourado 🚨",
          message: `Você estourou o orçamento de ${budget.category.name}! Gasto: R$ ${spent.toFixed(2)} / Limite: R$ ${budget.monthlyLimit.toFixed(2)}. Pare de gastar!`,
          type: "DANGER",
        });
      } else if (percentage >= 80) {
        await this.create({
          userId,
          title: "Atenção ao Orçamento ⚠️",
          message: `Você já usou ${percentage.toFixed(0)}% do orçamento de ${budget.category.name}. Cuidado!`,
          type: "WARNING",
        });
      }
    }
  },
};

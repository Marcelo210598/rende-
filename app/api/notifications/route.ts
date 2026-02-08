import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NotificationService } from "@/lib/notification-service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Trigger checks (in background or explicitly)
  await Promise.all([
    NotificationService.checkBillReminders(user.id),
    NotificationService.checkBudgetAlerts(user.id),
    NotificationService.checkExpenseAlerts(user.id),
  ]);
  const notifications = await NotificationService.getUnread(user.id);
  return NextResponse.json(notifications);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await NotificationService.markAsRead(id);

  return NextResponse.json({ success: true });
}

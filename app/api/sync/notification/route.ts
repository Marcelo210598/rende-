import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseNotification } from "@/lib/notification-parser";

// POST /api/sync/notification
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Validate User by Token
    const user = await prisma.user.findUnique({
      where: { mobileToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, packageName, timestamp, notificationId } = body;

    // 1. Generate externalId to prevent duplicates
    // Using a simple composite key or the provided notificationId from Android
    const externalId = notificationId || `${packageName}-${timestamp}-${title}`;

    // Check if valid expense info exists in text
    const parsed = parseNotification(title, message, packageName || "");

    if (!parsed) {
      return NextResponse.json({
        status: "ignored",
        reason: "Could not parse transaction details",
      });
    }

    // 2. Check for duplicate
    const existing = await prisma.expense.findUnique({
      where: { externalId },
    });

    if (existing) {
      return NextResponse.json({ status: "skipped", reason: "Duplicate" });
    }

    // 3. Find or Create Default Category
    // For now, let's put everything in "Outros" or a specific "Sync" category if it exists
    let category = await prisma.category.findFirst({
      where: {
        userId: user.id,
        name: "Outros",
      },
    });

    if (!category) {
      // Fallback to any category
      category = await prisma.category.findFirst({
        where: { userId: user.id },
      });
    }

    // 4. Create Expense
    const date = new Date();
    const expense = await prisma.expense.create({
      data: {
        userId: user.id,
        amount: parsed.amount,
        note: parsed.merchant, // Use merchant name as note
        date: parsed.date,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        categoryId: category?.id!, // We need a category. If users have none, this might fail. We should robustify.
        source: "ANDROID_SYNC",
        externalId,
        isPaid: true, // Usually notifications are for paid transactions
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "created",
      expenseId: expense.id,
      parsed,
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

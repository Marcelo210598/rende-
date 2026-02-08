import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// GET /api/user/sync-token
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { mobileToken: true },
    });

    return NextResponse.json({ token: user?.mobileToken });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST /api/user/sync-token (Regenerate)
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a secure random token (32 chars hex)
    const newToken = randomBytes(16).toString("hex");

    await prisma.user.update({
      where: { id: session.user.id },
      data: { mobileToken: newToken },
    });

    return NextResponse.json({ token: newToken });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

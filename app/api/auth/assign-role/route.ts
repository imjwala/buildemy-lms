import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (!role || (role !== "user" && role !== "teacher")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update user role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: role },
    });

    return NextResponse.json(
      { message: "Role assigned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Role assignment error:", error);
    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}

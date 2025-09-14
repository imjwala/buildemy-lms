import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();

    // Validate inputs
    if (!email || !role || (role !== "user" && role !== "teacher")) {
      return NextResponse.json(
        { error: "Invalid email or role" },
        { status: 400 }
      );
    }

    // Update user role based on email
    const user = await prisma.user.update({
      where: { email },
      data: { role },
    });

    return NextResponse.json(
      { message: "Role assigned successfully", user },
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

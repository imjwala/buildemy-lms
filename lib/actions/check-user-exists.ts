"use server";

import { prisma } from "@/lib/db";

export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    return !!user;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
}

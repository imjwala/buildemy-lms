"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 3, // Very restrictive for account deletion
  })
);

export const deleteUserAccount = async (): Promise<ApiResponse> => {
  const user = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    // Delete user account and all related data
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    // Revalidate all user-related paths
    revalidatePath("/user");
    revalidatePath("/user/settings");
    revalidatePath("/user/courses");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return {
      status: "error",
      message: "Failed to delete account. Please try again.",
    };
  }
};

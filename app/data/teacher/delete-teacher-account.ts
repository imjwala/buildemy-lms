"use server";

import { requireTeacher } from "@/app/data/teacher/require-teacher";
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

export const deleteTeacherAccount = async (): Promise<ApiResponse> => {
  const teacher = await requireTeacher();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: teacher.user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    // Delete teacher account and all related data
    await prisma.user.delete({
      where: {
        id: teacher.user.id,
      },
    });

    // Revalidate all teacher-related paths
    revalidatePath("/teacher");
    revalidatePath("/teacher/settings");
    revalidatePath("/teacher/courses");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting teacher account:", error);
    return {
      status: "error",
      message: "Failed to delete account. Please try again.",
    };
  }
};

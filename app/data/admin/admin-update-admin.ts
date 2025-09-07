"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export const adminUpdateAdmin = async (
  adminId: string,
  data: {
    name: string;
    email: string;
  }
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    // Validate input
    if (!data.name.trim()) {
      return {
        status: "error",
        message: "Name is required.",
      };
    }

    if (!data.email.trim()) {
      return {
        status: "error",
        message: "Email is required.",
      };
    }

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        id: adminId,
        role: "admin",
      },
    });

    if (!existingAdmin) {
      return {
        status: "error",
        message: "Admin not found.",
      };
    }

    // Check if email is already taken by another user
    const emailExists = await prisma.user.findFirst({
      where: {
        email: data.email.trim(),
        id: {
          not: adminId,
        },
      },
    });

    if (emailExists) {
      return {
        status: "error",
        message: "Email is already taken by another user.",
      };
    }

    // Update admin
    await prisma.user.update({
      where: {
        id: adminId,
      },
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        updatedAt: new Date(),
      },
    });

    // Revalidate admin paths
    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return {
      status: "success",
      message: "Admin updated successfully.",
    };
  } catch (error) {
    console.error("Error updating admin:", error);
    return {
      status: "error",
      message: "Failed to update admin. Please try again.",
    };
  }
};

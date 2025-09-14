"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export const adminCreateAdmin = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse> => {
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

    if (!data.password.trim()) {
      return {
        status: "error",
        message: "Password is required.",
      };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email.trim(),
      },
    });

    if (existingUser) {
      return {
        status: "error",
        message: "Email is already taken by another user.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create admin user
    const newAdmin = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name.trim(),
        email: data.email.trim(),
        emailVerified: false,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create account with password
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: newAdmin.id,
        providerId: "credential",
        userId: newAdmin.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Revalidate admin paths
    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return {
      status: "success",
      message: `Admin "${newAdmin.name}" created successfully.`,
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    return {
      status: "error",
      message: "Failed to create admin. Please try again.",
    };
  }
};

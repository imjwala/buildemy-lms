"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export const adminUpdateProfile = async (data: {
  name: string;
  image?: string;
}): Promise<ApiResponse> => {
  const session = await requireAdmin();

  try {
    // Validate input
    if (!data.name.trim()) {
      return {
        status: "error",
        message: "Name is required.",
      };
    }

    // Update admin profile
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name.trim(),
        image: data.image || null,
        updatedAt: new Date(),
      },
    });

    // Revalidate admin paths
    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return {
      status: "success",
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return {
      status: "error",
      message: "Failed to update profile. Please try again.",
    };
  }
};

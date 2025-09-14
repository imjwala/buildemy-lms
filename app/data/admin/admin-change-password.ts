"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export const adminChangePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse> => {
  const session = await requireAdmin();

  try {
    // Get the admin's account with password
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
      },
      select: {
        password: true,
      },
    });

    if (!account?.password) {
      return {
        status: "error",
        message: "Password change not available for this account type.",
      };
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(
      data.oldPassword,
      account.password
    );
    if (!isOldPasswordValid) {
      return {
        status: "error",
        message: "Current password is incorrect.",
      };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(data.newPassword, 12);

    // Update password
    await prisma.account.updateMany({
      where: {
        userId: session.user.id,
        providerId: "credential",
      },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    // Revalidate admin paths
    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return {
      status: "success",
      message: "Password updated successfully.",
    };
  } catch (error) {
    console.error("Error changing admin password:", error);
    return {
      status: "error",
      message: "Failed to change password. Please try again.",
    };
  }
};

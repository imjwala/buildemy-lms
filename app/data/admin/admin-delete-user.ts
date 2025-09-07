"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export const adminDeleteUser = async (userId: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    // First, check if the user exists and is actually a user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        enrollment: {
          select: {
            id: true,
            Course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return {
        status: "error",
        message: "User not found or is not a student.",
      };
    }

    // Check if user has active enrollments
    const activeEnrollments = user.enrollment.filter(
      (enrollment) => enrollment.Course
    );

    if (activeEnrollments.length > 0) {
      return {
        status: "error",
        message: `Cannot delete user "${user.name}" because they have ${activeEnrollments.length} active enrollment(s). Please handle their enrollments first.`,
      };
    }

    // Delete the user account and all related data
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    // Revalidate admin paths
    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return {
      status: "success",
      message: `User "${user.name}" has been deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      status: "error",
      message: "Failed to delete user. Please try again.",
    };
  }
};

"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export const adminDeleteTeacher = async (
  teacherId: string
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    // First, check if the teacher exists and is actually a teacher
    const teacher = await prisma.user.findUnique({
      where: {
        id: teacherId,
        role: "teacher",
      },
      select: {
        id: true,
        name: true,
        courses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!teacher) {
      return {
        status: "error",
        message: "Teacher not found or is not a teacher.",
      };
    }

    // Check if teacher has courses
    if (teacher.courses.length > 0) {
      return {
        status: "error",
        message: `Cannot delete teacher "${teacher.name}" because they have ${teacher.courses.length} course(s). Please transfer or delete their courses first.`,
      };
    }

    // Delete the teacher account and all related data
    await prisma.user.delete({
      where: {
        id: teacherId,
      },
    });

    // Revalidate admin paths
    revalidatePath("/admin");
    revalidatePath("/admin/teachers");

    return {
      status: "success",
      message: `Teacher "${teacher.name}" has been deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return {
      status: "error",
      message: "Failed to delete teacher. Please try again.",
    };
  }
};

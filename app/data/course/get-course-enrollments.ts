import "server-only";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getCourseEnrollments = async (courseId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  // First check if the current user owns this course
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      userId: true,
    },
  });

  if (!course || course.userId !== session.user.id) {
    return null;
  }

  // Get enrollment data for this course
  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId: courseId,
    },
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      User: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    isOwner: true,
    enrollments,
    totalEnrollments: enrollments.length,
    totalRevenue: enrollments.reduce(
      (sum, enrollment) => sum + enrollment.amount,
      0
    ),
  };
};

export type CourseEnrollmentsType = Awaited<
  ReturnType<typeof getCourseEnrollments>
>;

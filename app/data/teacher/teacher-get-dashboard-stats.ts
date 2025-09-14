import "server-only";
import { prisma } from "@/lib/db";
import { requireTeacher } from "./require-teacher";

export const teacherGetDashboardStats = async () => {
  const session = await requireTeacher();

  const [totalCourses, totalLessons, totalEnrollments, totalRevenue] =
    await Promise.all([
      // Total courses for this teacher
      prisma.course.count({
        where: {
          userId: session.user.id,
        },
      }),
      // Total lessons for this teacher's courses
      prisma.lesson.count({
        where: {
          Chapter: {
            Course: {
              userId: session.user.id,
            },
          },
        },
      }),
      // Total enrollments for this teacher's courses
      prisma.enrollment.count({
        where: {
          Course: {
            userId: session.user.id,
          },
        },
      }),
      // Total revenue from this teacher's courses
      prisma.enrollment.aggregate({
        where: {
          Course: {
            userId: session.user.id,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

  return {
    totalCourses,
    totalLessons,
    totalEnrollments,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};

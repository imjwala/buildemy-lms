import "server-only";
import { prisma } from "@/lib/db";
import { requireTeacher } from "./require-teacher";

export const teacherGetEnrollmentStats = async () => {
  const session = await requireTeacher();

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
      Course: {
        userId: session.user.id,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const last30days: { date: string; enrollments: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last30days.push({
      date: date.toISOString().split("T")[0],
      enrollments: 0,
    });
  }

  enrollments.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const day = last30days.find((day) => day.date === enrollmentDate);

    if (day) {
      day.enrollments++;
    }
  });

  return last30days;
};

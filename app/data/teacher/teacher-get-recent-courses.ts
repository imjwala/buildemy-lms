import "server-only";
import { prisma } from "@/lib/db";
import { requireTeacher } from "./require-teacher";

export const teacherGetRecentCourses = async () => {
  const session = await requireTeacher();

  const data = await prisma.course.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6, // Show only 6 recent courses
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      filekey: true,
      slug: true,
      createdAt: true,
    },
  });

  return data;
};

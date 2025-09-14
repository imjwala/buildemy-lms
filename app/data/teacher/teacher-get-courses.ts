import "server-only";
import { prisma } from "@/lib/db";
import { requireTeacher } from "./require-teacher";

export const teacherGetCourses = async () => {
  //await new Promise((resolve) => setTimeout(resolve, 3000));

  const session = await requireTeacher();

  const data = await prisma.course.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
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
    },
  });

  return data;
};

export type TeacherCourseType = Awaited<
  ReturnType<typeof teacherGetCourses>
>[0];

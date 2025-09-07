import "server-only";
import { requireTeacher } from "./require-teacher";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const teacherGetCourse = async (id: string) => {
  const session = await requireTeacher();

  const data = await prisma.course.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      filekey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

export type TeacherCourseSingularType = Awaited<
  ReturnType<typeof teacherGetCourse>
>;

import "server-only"
import { prisma } from "@/lib/db";
import { requireTeacher } from "./require-teacher";
import { notFound } from "next/navigation";


export async function teacherGetLesson(id: string) {
  await requireTeacher();

  const data = await prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      position: true,
    }
  });

  if (!data) {
    return notFound()
  }

  return data;
}


export type TeacherLessonSingularType = Awaited<ReturnType<typeof teacherGetLesson>>;
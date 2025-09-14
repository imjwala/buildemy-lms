import "server-only"
import { requireTeacher } from "./require-teacher"
import { prisma } from "@/lib/db"

export const getAllCourses = async () => {
  await requireTeacher()

  const data = await prisma.course.findMany({
    select: {
      id: true,
      smallDescription: true,
      title: true,
      filekey: true,
      price: true,
      category: true,
      level: true,
      slug: true,
      duration: true,
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
              position: true,
            },
          },
        },
      },
    },
  })

  return data
}

export type CourseType = Awaited<ReturnType<typeof getAllCourses>>[0]

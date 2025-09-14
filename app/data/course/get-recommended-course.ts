import { prisma } from "@/lib/db"

export const getRecommendedCourses = async (category: string, excludeCourseId: string) => {
  return await prisma.course.findMany({
    where: {
      category,
      NOT: {
        id: excludeCourseId,
      },
    },
    take: 4, // just a few recommendations
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      filekey: true,
      smallDescription: true,
      price: true,
      duration: true,
      level: true,
      category: true,
    },
  })
}

export type RecommendedCourseType = Awaited<ReturnType<typeof getRecommendedCourses>>

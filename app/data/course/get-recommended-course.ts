import { prisma } from "@/lib/db"

export const getRecommendedCourses = async (category: string, excludeCourseId: string) => {
  return await prisma.course.findMany({
    where: {
      category, // just a string match
      NOT: {
        id: excludeCourseId,
      },
    },
    take: 4,
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

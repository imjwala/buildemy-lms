import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export const adminGetTeacher = async (teacherId: string) => {
  await requireAdmin();

  const teacher = await prisma.user.findUnique({
    where: {
      id: teacherId,
      role: "teacher",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      courses: {
        select: {
          id: true,
          title: true,
          smallDescription: true,
          filekey: true,
          price: true,
          duration: true,
          level: true,
          status: true,
          slug: true,
          createdAt: true,
          enrollment: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!teacher) {
    return notFound();
  }

  return teacher;
};

export type AdminTeacherDetailType = Awaited<
  ReturnType<typeof adminGetTeacher>
>;

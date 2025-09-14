import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetTeachers = async () => {
  await requireAdmin();

  const teachers = await prisma.user.findMany({
    where: {
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return teachers;
};

export type AdminTeacherType = Awaited<ReturnType<typeof adminGetTeachers>>[0];

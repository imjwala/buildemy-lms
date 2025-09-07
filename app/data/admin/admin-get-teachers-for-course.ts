import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetTeachersForCourse = async () => {
  await requireAdmin();

  const teachers = await prisma.user.findMany({
    where: {
      role: "teacher",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return teachers;
};

export type AdminTeacherForCourseType = Awaited<
  ReturnType<typeof adminGetTeachersForCourse>
>[0];

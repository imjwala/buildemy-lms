import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetUsers = async () => {
  await requireAdmin();

  const users = await prisma.user.findMany({
    where: {
      role: "user",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      enrollment: {
        select: {
          id: true,
          Course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export type AdminUserType = Awaited<ReturnType<typeof adminGetUsers>>[0];

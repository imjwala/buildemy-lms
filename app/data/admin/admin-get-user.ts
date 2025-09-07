import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export const adminGetUser = async (userId: string) => {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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
          amount: true,
          status: true,
          createdAt: true,
          Course: {
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
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  return user;
};

export type AdminUserDetailType = Awaited<ReturnType<typeof adminGetUser>>;

import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetAdmins = async () => {
  await requireAdmin();

  const admins = await prisma.user.findMany({
    where: {
      role: "admin",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return admins;
};

export type AdminAdminType = Awaited<ReturnType<typeof adminGetAdmins>>[0];

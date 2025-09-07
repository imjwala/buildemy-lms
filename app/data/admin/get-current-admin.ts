import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const getCurrentAdmin = async () => {
  const session = await requireAdmin();

  const currentAdmin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
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
  });

  return currentAdmin;
};

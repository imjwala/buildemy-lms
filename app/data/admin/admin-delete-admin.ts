// lib/actions/admin-delete-admin.ts
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export const adminDeleteAdmin = async (adminId: string): Promise<ApiResponse> => {
  try {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });

    if (!admin) return { status: "error", message: "Admin not found." };

    if (admin.email === process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL) {
      return { status: "error", message: "Cannot delete the main admin!" };
    }

    await prisma.user.delete({ where: { id: adminId } });

    // Optional: Revalidate pages
    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return { status: "success", message: `Admin "${admin.name}" deleted successfully.` };
  } catch (err) {
    console.error(err);
    return { status: "error", message: "Failed to delete admin. Please try again." };
  }
};

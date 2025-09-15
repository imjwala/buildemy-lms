"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";
import { generateAdminCredentialsEmail } from "@/lib/email-templates";
import nodemailer from "nodemailer";

export const adminCreateAdmin = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse & { admin?: any }> => { // <-- add optional admin
  await requireAdmin();

  try {
    if (!data.name.trim()) return { status: "error", message: "Name is required." };
    if (!data.email.trim()) return { status: "error", message: "Email is required." };
    if (!data.password.trim()) return { status: "error", message: "Password is required." };

    const existingUser = await prisma.user.findUnique({ where: { email: data.email.trim() } });
    if (existingUser) return { status: "error", message: "Email is already taken." };

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newAdmin = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name.trim(),
        email: data.email.trim(),
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: newAdmin.id,
        providerId: "credential",
        userId: newAdmin.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Buildemy Admin" <${env.SMTP_USER}>`,
      to: data.email.trim(),
      subject: "Your Admin Account Credentials",
      html: generateAdminCredentialsEmail(data.name.trim(), data.email.trim(), data.password),
    });

    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    
    return {
      status: "success",
      message: `Admin "${newAdmin.name}" created and credentials sent via email.`,
      admin: newAdmin,
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    return { status: "error", message: "Failed to create admin. Please try again." };
  }
};

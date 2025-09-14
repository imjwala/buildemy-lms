"use server";

import { requireTeacher } from "@/app/data/teacher/require-teacher";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { userProfileSchema, UserProfileSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export const updateTeacherProfile = async (
  data: UserProfileSchemaType
): Promise<ApiResponse> => {
  const teacher = await requireTeacher();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: teacher.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting",
        };
      } else {
        return {
          status: "error",
          message:
            "Automated request blocked. If this is a mistake, please contact support",
        };
      }
    }

    const result = userProfileSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    // Use filekey if available, otherwise use imageUrl
    const imageValue = result.data.filekey || result.data.imageUrl || null;

    await prisma.user.update({
      where: {
        id: teacher.user.id,
      },
      data: {
        name: result.data.name,
        image: imageValue,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/teacher/settings");
    revalidatePath("/teacher");

    return {
      status: "success",
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Teacher profile update error:", error);
    return {
      status: "error",
      message: "Failed to update profile. Please try again later.",
    };
  }
};

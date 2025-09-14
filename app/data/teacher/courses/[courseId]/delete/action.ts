"use server"

import { requireTeacher } from "@/app/data/teacher/require-teacher";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet 
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5
    })
  )

export const DeleteCourse = async(courseId: string):Promise<ApiResponse> => {
  
  const session = await requireTeacher();

  try {

    const req = await request();                  
    const decision = await aj.protect(req, {      
      fingerprint: session?.user.id
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting"
        }
      } else {
        return {
          status: "error",
          message: "Automated request blocked. If this is a mistake, please contact support"
        }
      }
    }

    await prisma.course.delete({
      where: {
        id: courseId
      }
    })

    revalidatePath("/teacher/courses");

    return {
      status: "success",
      message: "Course deleted successfully",
    }

  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete course",
    }
  }

}


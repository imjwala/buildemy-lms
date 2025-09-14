"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function CreateCouse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    console.log("Received course data:", values);
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id,
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

    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    console.log("Validation passed, creating Stripe product...");
    console.log("TeacherId:", validation.data.teacherId);

    let stripeProduct;
    try {
      stripeProduct = await stripe.products.create({
        name: validation.data.title,
        description: validation.data.smallDescription,
        default_price_data: {
          currency: "usd",
          unit_amount: validation.data.price * 100,
        },
      });
      console.log("Stripe product created:", stripeProduct.id);
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      throw new Error(`Stripe error: ${stripeError}`);
    }

    let course;
    try {
      // Extract teacherId and create course data without it
      const { teacherId, ...courseData } = validation.data;

      course = await prisma.course.create({
        data: {
          ...courseData,
          userId: teacherId,
          stripePriceId: stripeProduct.default_price as string,
        },
      });
      console.log("Course created successfully:", course.id);
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError}`);
    }

    return {
      status: "success",
      message: `Course "${course.title}" created successfully`,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      status: "error",
      message:
        "Failed to create the course. Please check server logs for details.",
    };
  }
}

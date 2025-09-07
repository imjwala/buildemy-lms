"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/type";
import { request } from "@arcjet/next";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

type PaymentMethod = "stripe" | "esewa";

function generateSignature(total_amount: string, transaction_uuid: string, product_code: string, secret: string): string {
  const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = CryptoJS.HmacSHA256(hashString, secret);
  return CryptoJS.enc.Base64.stringify(hash);
}

export const activateEnrollment = async (userId: string, courseId: string): Promise<ApiResponse> => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { status: true, id: true },
  });

  if (!enrollment) return { status: "error", message: "Enrollment not found" };
  if (enrollment.status === "Active") return { status: "error", message: "Already enrolled. Payment rejected." };

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: { status: "Active", updatedAt: new Date() },
  });

  return { status: "success", message: "Enrollment activated successfully" };
};

export const enrollInCourseAction = async (courseId: string, paymentMethod: PaymentMethod): Promise<ApiResponse | never> => {
  const user = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });

    if (decision.isDenied()) return { status: "error", message: "You have been blocked" };

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true, slug: true, stripePriceId: true },
    });

    if (!course) return { status: "error", message: "Course not found" };

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { status: true, id: true },
    });

    if (existingEnrollment?.status === "Active") return { status: "error", message: "You are already enrolled in this course" };

    if (paymentMethod === "stripe") {
      if (!course.stripePriceId) return { status: "error", message: "This course is not available for purchase via Stripe at the moment." };

      let stripeCustomerId: string;
      const userWithStripeCustomerId = await prisma.user.findUnique({
        where: { id: user.id },
        select: { stripeCustomerId: true },
      });

      if (userWithStripeCustomerId?.stripeCustomerId) {
        stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user.id },
        });
        stripeCustomerId = customer.id;
        await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId } });
      }

      const enrollment = existingEnrollment
        ? await prisma.enrollment.update({
            where: { id: existingEnrollment.id },
            data: { amount: course.price, status: "Pending", updatedAt: new Date() },
          })
        : await prisma.enrollment.create({
            data: { userId: user.id, courseId: course.id, amount: course.price, status: "Pending" },
          });

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [{ price: course.stripePriceId, quantity: 1 }],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success?courseId=${course.id}`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: { userId: user.id, courseId: course.id, enrollmentId: enrollment.id },
      });

      return { status: "success", checkoutUrl: checkoutSession.url ?? undefined };
    }

    if (paymentMethod === "esewa") {
      const transaction_uuid = uuidv4();
      const product_code = "EPAYTEST";
      const secret = "8gBm/:&EnhH.1/q";
      const exchangeRate = 140;
      const total_amount = (course.price * exchangeRate).toFixed(2);

      const enrollment = existingEnrollment
        ? await prisma.enrollment.update({
            where: { id: existingEnrollment.id },
            data: { amount: course.price, status: "Pending", updatedAt: new Date() },
          })
        : await prisma.enrollment.create({
            data: { userId: user.id, courseId: course.id, amount: course.price, status: "Pending" },
          });

      const signature = generateSignature(total_amount, transaction_uuid, product_code, secret);

      const esewaFormHtml = `
        <form id="esewa-payment-form" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
          <input type="hidden" name="amount" value="${total_amount}" />
          <input type="hidden" name="tax_amount" value="0" />
          <input type="hidden" name="total_amount" value="${total_amount}" />
          <input type="hidden" name="transaction_uuid" value="${transaction_uuid}" />
          <input type="hidden" name="product_service_charge" value="0" />
          <input type="hidden" name="product_delivery_charge" value="0" />
          <input type="hidden" name="product_code" value="${product_code}" />
          <input type="hidden" name="success_url" value="${env.BETTER_AUTH_URL}/payment/success?method=esewa&courseId=${course.id}" />
          <input type="hidden" name="failure_url" value="${env.BETTER_AUTH_URL}/payment/cancel?method=esewa" />
          <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
          <input type="hidden" name="signature" value="${signature}" />
        </form>
        <script>document.getElementById('esewa-payment-form').submit();</script>
      `;

      return { status: "success", html: esewaFormHtml };
    }

    return { status: "error", message: "Invalid payment method" };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) return { status: "error", message: "Payment system error. Please try again later" };
    return { status: "error", message: "Failed to enroll in course" };
  }
};

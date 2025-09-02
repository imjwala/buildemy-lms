import { auth } from "@/lib/auth";
import arcjet from "@/lib/arcjet"
import ip from "@arcjet/ip";
import {
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

/**
 * Configuration for Arcjet email validation.
 * @see https:
 */
const emailOptions = {
  mode: "LIVE", 
  
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

/**
 * Configuration for Arcjet bot detection.
 * @see https:
 */
const botOptions = {
  mode: "LIVE",
  
  allow: [], 
} satisfies BotOptions;

/**
 * Configuration for Arcjet rate limiting.
 * @see https:
 */
const rateLimitOptions = {
  mode: "LIVE",
  interval: "2m", 
  max: 5, 
} satisfies SlidingWindowRateLimitOptions<[]>;

/**
 * Configuration for Arcjet signup protection.
 * Combines email validation, bot detection, and rate limiting.
 * @see https:
 */
const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

/**
 * Protects a request (`NextRequest`) by applying Arcjet security rules.
 * @param req - The incoming NextRequest object.
 * @returns A promise that resolves with the Arcjet decision.
 */
async function protect(req: NextRequest): Promise<ArcjetDecision> {
  
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1"; 
  }

  if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
    
    const body = await req.clone().json();

    if (typeof body.email === "string") {
      return arcjet
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, fingerprint: userId });
    } else {
      return arcjet
        .withRule(detectBot(botOptions))
        .withRule(slidingWindow(rateLimitOptions))
        .protect(req, { fingerprint: userId });
    }
  } else {
    return arcjet.withRule(detectBot(botOptions)).protect(req, { fingerprint: userId });
  }
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

/**
 * Wraps the POST handler with Arcjet protections.
 * Each POST request will first go through Arcjet before reaching the authentication logic.
 */
export const POST = async (req: NextRequest) => {
  
  const decision = await protect(req);

  console.log("Arcjet Decision:", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "The email format is invalid. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Your email domain has no MX record. Is there a typo?";
      } else {
        message = "Invalid email.";
      }

      return Response.json({ message }, { status: 400 });
    } else {
      return new Response(null, { status: 403 });
    }
  }

  return authHandlers.POST(req);
};

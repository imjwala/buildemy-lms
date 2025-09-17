import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import { fixedWindow } from "arcjet";
import arcjet from "@/lib/arcjet";
import { requireUser } from "@/app/data/user/require-user";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function POST(request: Request) {
  // Require user session
  const session = await requireUser();

  try {
    // Rate limiting with Arcjet
    const decision = await aj.protect(request, {
      fingerprint: session.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "You are not allowed to perform this action" },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Define schema inside POST to avoid Next.js export issues
    const fileUploadSchema = z.object({
      fileName: z.string().min(1, { message: "File name is required" }),
      contentType: z.string().min(1, { message: "Content type is required" }),
      size: z.number().min(1, { message: "Size is required" }),
      isImage: z.boolean(),
    });

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;

    // Only allow image files
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed for profile pictures" },
        { status: 400 }
      );
    }

    // Limit file size to 5MB
    if (size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique key for S3
    const uniqueKey = `user-avatars/${session.id}/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    // Generate presigned URL
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });

    return NextResponse.json({
      presignedUrl,
      key: uniqueKey,
    });
  } catch (error) {
    console.error("Error uploading file", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}

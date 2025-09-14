import { description } from "@/components/sidebar/chart-area-interactive";
import { th } from "date-fns/locale";
import { title } from "process";
import z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Ai/Ml",
  "Art",
  "Bussiness",
  "Design",
  "Development",
  "Education",
  "Entertainment",
  "Finance",
  "Food & Drink",
  "Gaming",
  "Health & Fitness",
  "It & Software",
  "Marketing",
  "Music",
  "Office productivity",
  "Personal Development",
  "Photography",
  "Sports",
  "Travel",
  "Videography",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" }),
  filekey: z.string().min(1, { message: "Filekey is required" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be a positive number" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hours" })
    .max(500, { message: "Duration must be at most 500 hours" }),
  level: z.enum(courseLevels, { message: "Level is required" }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters long" })
    .max(200, {
      message: "Small description must be at most 200 characters long",
    }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
  teacherId: z.string().min(1, { message: "Teacher is required" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

// Schema for teacher course creation (without teacherId field)
export const teacherCourseSchema = courseSchema.omit({ teacherId: true });
export type TeacherCourseSchemaType = z.infer<typeof teacherCourseSchema>;

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
});

export type ChapterSchemaType = z.infer<typeof chapterSchema>;

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
  chapterId: z.string().uuid({ message: "Invalid chapter id" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;

export const userProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be at most 50 characters long" }),
    filekey: z.string().optional(),
    imageUrl: z
      .string()
      .url({ message: "Image URL must be a valid URL" })
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.filekey || data.imageUrl, {
    message: "Either upload a file or provide an image URL",
    path: ["filekey"],
  });

export type UserProfileSchemaType = z.infer<typeof userProfileSchema>;

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters long" })
      .max(100, {
        message: "New password must be at most 100 characters long",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordChangeSchemaType = z.infer<typeof passwordChangeSchema>;

export const editAdminSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export type EditAdminSchemaType = z.infer<typeof editAdminSchema>;

export const addAdminSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be at most 50 characters long" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must be at most 100 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AddAdminSchemaType = z.infer<typeof addAdminSchema>;

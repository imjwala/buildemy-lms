// app/actions/teacher-actions.ts
"use server";

import { updateTeacherProfile } from "@/app/data/teacher/update-teacher-profile";
import { deleteTeacherAccount } from "@/app/data/teacher/delete-teacher-account";

export async function safeUpdateTeacherProfile(data: {
  name: string;
  filekey?: string;
  imageUrl?: string;
}) {
  const res = await updateTeacherProfile(data);
  return {
    status: res.status,
    message: res.message ?? "Profile updated successfully",
  };
}

export async function safeDeleteTeacherAccount() {
  const res = await deleteTeacherAccount();
  return {
    status: res.status,
    message: res.message ?? "Account deleted successfully",
  };
}

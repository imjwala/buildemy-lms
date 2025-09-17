// app/actions/user-actions.ts
"use server";

import { updateUserProfile } from "@/app/data/user/update-profile";
import { deleteUserAccount } from "@/app/data/user/delete-account";

export async function safeUpdateUserProfile(data: {
  name: string;
  filekey?: string;
  imageUrl?: string;
}) {
  const res = await updateUserProfile(data);
  return {
    status: res.status,
    message: res.message ?? "Profile updated successfully",
  };
}

export async function safeDeleteUserAccount() {
  const res = await deleteUserAccount();
  return {
    status: res.status,
    message: res.message ?? "Account deleted successfully",
  };
}

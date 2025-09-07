"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { tryCatch } from "@/hooks/try-catch";
import {
  userProfileSchema,
  UserProfileSchemaType,
  passwordChangeSchema,
  PasswordChangeSchemaType,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { adminUpdateProfile } from "@/app/data/admin/admin-update-profile";
import { adminChangePassword } from "@/app/data/admin/admin-change-password";

interface AdminProfileFormProps {
  admin: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
  };
}

export const AdminProfileForm = ({ admin }: AdminProfileFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: admin.name,
      filekey:
        admin.image && !admin.image.startsWith("http") ? admin.image : "",
      imageUrl:
        admin.image && admin.image.startsWith("http") ? admin.image : "",
    },
  });

  const passwordForm = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: UserProfileSchemaType) => {
    startTransition(async () => {
      // Clear the opposite field when one is used
      const submitData = {
        ...values,
        filekey: values.filekey || "",
        imageUrl: values.imageUrl || "",
      };

      const { data: result, error } = await tryCatch(
        adminUpdateProfile(submitData)
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  const onPasswordSubmit = (values: PasswordChangeSchemaType) => {
    startPasswordTransition(async () => {
      const { data: result, error } = await tryCatch(
        adminChangePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        passwordForm.reset();
        setShowPasswordForm(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="rounded-lg border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information and profile picture.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="filekey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Profile Picture</FormLabel>
                <FormControl>
                  <Uploader
                    onChange={field.onChange}
                    value={field.value}
                    fileTypeAccepted="image"
                    uploadEndpoint="/api/s3/upload"
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  Upload a profile picture. Supported formats: JPG, PNG, GIF.
                  Max size: 5MB.
                </p>
              </FormItem>
            )}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/your-image.jpg"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  Enter a valid image URL for your profile picture (e.g., GitHub
                  avatar).
                </p>
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Account Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{admin.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium capitalize">{admin.role}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Email and role cannot be changed. Contact support if you need
              assistance.
            </p>
          </div>

          {/* Password Change Section */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Change Password</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </Button>
            </div>

            {showPasswordForm && (
              <div className="space-y-4">
                <Form {...passwordForm}>
                  <div
                    className="space-y-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        passwordForm.handleSubmit(onPasswordSubmit)();
                      }
                    }}
                  >
                    <FormField
                      control={passwordForm.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your current password"
                              {...field}
                              disabled={isPasswordPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your new password"
                              {...field}
                              disabled={isPasswordPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your new password"
                              {...field}
                              disabled={isPasswordPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          passwordForm.reset();
                          setShowPasswordForm(false);
                        }}
                        disabled={isPasswordPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() =>
                          passwordForm.handleSubmit(onPasswordSubmit)()
                        }
                        disabled={isPasswordPending}
                      >
                        {isPasswordPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

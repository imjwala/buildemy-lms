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
import { userProfileSchema, UserProfileSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

interface UserProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
  };
  updateProfile: (data: UserProfileSchemaType) => Promise<{
    status: string;
    message: string;
  }>;
  deleteAccount: () => Promise<{
    status: string;
    message: string;
  }>;
}

export const UserProfileForm = ({
  user,
  updateProfile,
  deleteAccount,
}: UserProfileFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name,
      filekey: user.image && !user.image.startsWith("http") ? user.image : "",
      imageUrl: user.image && user.image.startsWith("http") ? user.image : "",
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

      const { data: result, error } = await tryCatch(updateProfile(submitData));

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
                    uploadEndpoint="/api/s3/upload-user"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <DeleteAccountDialog deleteAccount={deleteAccount} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div> */}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Email and role cannot be changed. Contact support if you need
              assistance.
            </p>
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

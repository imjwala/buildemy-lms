"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { addAdminSchema, AddAdminSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { adminCreateAdmin } from "@/app/data/admin/admin-create-admin";
import { AdminAdminType } from "@/app/data/admin/admin-get-admins";

interface AddNewAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newAdmin: AdminAdminType) => void;
}

export const AddNewAdminModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddNewAdminModalProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddAdminSchemaType>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: AddAdminSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        adminCreateAdmin({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success" && result.admin) {
        toast.success(result.message);
        onClose(); // close modal
        form.reset(); // reset form

        // Pass the newly created admin to parent
        onSuccess?.({
          id: result.admin.id,
          name: result.admin.name,
          email: result.admin.email,
          createdAt: new Date(result.admin.createdAt),
          updatedAt: new Date(result.admin.updatedAt),
          image: result.admin.image || "",
          role: result.admin.role || "admin",
        });
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Admin
          </DialogTitle>
          <DialogDescription>
            Create a new admin account with full system access.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter admin name" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter admin email" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Confirm password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Admin
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

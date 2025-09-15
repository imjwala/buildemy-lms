"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

interface DeleteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: { id: string; name: string; email: string };
  onDeleted: (deletedAdminId: string) => void;
}

export const DeleteAdminModal = ({ isOpen, onClose, admin, onDeleted }: DeleteAdminModalProps) => {
  const [isPending, startTransition] = useTransition();

  const isMainAdmin = admin.email === process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL;

  const handleDelete = () => {
    if (isMainAdmin) return; // extra safety

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/delete-admin?id=${admin.id}`, { method: "DELETE" });
        const data = await res.json();

        if (data.status === "error") {
          toast.error(data.message);
          return;
        }

        toast.success(data.message);
        onDeleted(admin.id); // remove from table immediately
        onClose();
      } catch (err) {
        console.error(err);
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Admin</DialogTitle>
          <DialogDescription>
            {isMainAdmin
              ? "The main admin cannot be deleted."
              : `Are you sure you want to delete ${admin.name}? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending || isMainAdmin}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

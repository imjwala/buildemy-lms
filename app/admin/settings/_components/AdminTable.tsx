"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminAdminType } from "@/app/data/admin/admin-get-admins";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditAdminModal } from "./EditAdminModal";
import { DeleteAdminModal } from "./DeleteAdminModal";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface AdminTableProps {
  admins: AdminAdminType[];
}

export const AdminTable = ({ admins: initialAdmins }: AdminTableProps) => {
  const [admins, setAdmins] = useState<AdminAdminType[]>(initialAdmins);
  const [editingAdmin, setEditingAdmin] = useState<AdminAdminType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminAdminType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (admin: AdminAdminType) => {
    setEditingAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAdmin(null);
  };

  const handleDeleteClick = (admin: AdminAdminType) => {
    setDeletingAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAdmin(null);
  };

  // Remove admin from local state after successful deletion
  const handleAdminDeleted = (deletedAdminId: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== deletedAdminId));
    handleCloseDeleteModal();
  };

  if (admins.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No admins found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => {
            const imageUrl =
              admin.image && !admin.image.startsWith("http")
                ? useConstructUrl(admin.image)
                : admin.image || "";

            return (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={imageUrl} alt={admin.name} />
                      <AvatarFallback>
                        {admin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">
                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">
                    {new Date(admin.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(admin)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(admin)}
                      disabled={admin.email === process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL}
                      title={
                        admin.email === process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL
                          ? "Cannot delete main admin"
                          : undefined
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {editingAdmin && (
        <EditAdminModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          admin={editingAdmin}
        />
      )}

      {deletingAdmin && (
        <DeleteAdminModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          admin={deletingAdmin}
          onDeleted={handleAdminDeleted} 
        />
      )}
    </div>
  );
};

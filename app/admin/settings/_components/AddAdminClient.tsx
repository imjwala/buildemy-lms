"use client";

import { AdminTable } from "./AdminTable";
import { EmptyState } from "@/components/general/EmptyState";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { AddNewAdminModal } from "./AddNewAdminModal";
import { AdminAdminType } from "@/app/data/admin/admin-get-admins";

interface AddAdminClientProps {
  initialAdmins: AdminAdminType[];
}

export const AddAdminClient = ({ initialAdmins }: AddAdminClientProps) => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSuccess = (newAdmin: AdminAdminType) => {
    // Immediately update local state
    setAdmins((prev) => [newAdmin, ...prev]);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Admin Management</h2>
          <p className="text-muted-foreground">
            Manage all admin accounts in the system
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Admin
        </Button>
      </div>

      {admins.length === 0 ? (
        <EmptyState
          title="No Admins Found"
          description="There are no admin accounts in the system yet."
          buttonText="View Dashboard"
          href="/admin"
        />
      ) : (
        <AdminTable admins={admins} />
      )}

      <AddNewAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess} 
      />
    </>
  );
};

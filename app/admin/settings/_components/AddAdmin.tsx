import { adminGetAdmins } from "@/app/data/admin/admin-get-admins";
import { AdminTable } from "./AdminTable";
import { EmptyState } from "@/components/general/EmptyState";
import { AddAdminClient } from "./AddAdminClient";

const AddAdmin = async () => {
  const admins = await adminGetAdmins();

  return <AddAdminClient initialAdmins={admins} />;
};

export default AddAdmin;

import { adminGetUsers } from "@/app/data/admin/admin-get-users";
import { UserTable } from "./_components/UserTable";
import { EmptyState } from "@/components/general/EmptyState";

const UsersPage = async () => {
  const users = await adminGetUsers();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage all users in your platform
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState
          title="No Users Found"
          description="There are no users registered on the platform yet."
          buttonText="View Dashboard"
          href="/admin"
        />
      ) : (
        <UserTable users={users} />
      )}
    </>
  );
};

export default UsersPage;

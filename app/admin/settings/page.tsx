import { getCurrentAdmin } from "@/app/data/admin/get-current-admin";
import { AdminProfileForm } from "./_components/AdminProfileForm";
import { AdminProfilePreview } from "./_components/AdminProfilePreview";
import AddAdmin from "./_components/AddAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettingsPage = async () => {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold text-muted-foreground">
          Please sign in as admin to access settings
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin account settings and system configuration.
        </p>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="add-admin">Add Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2">
                <AdminProfileForm admin={currentAdmin} />
              </div>

              {/* Profile Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <AdminProfilePreview admin={currentAdmin} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add-admin" className="mt-6">
            <AddAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminSettingsPage;

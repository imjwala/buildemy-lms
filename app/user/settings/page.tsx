import { getCurrentUser } from "@/app/data/user/get-current-user";
import { updateUserProfile } from "@/app/data/user/update-profile";
import { deleteUserAccount } from "@/app/data/user/delete-account";
import { UserProfileForm } from "./_components/UserProfileForm";
import { ProfilePreview } from "./_components/ProfilePreview";

const UserSettingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold text-muted-foreground">
          Please sign in to access settings
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <UserProfileForm
            user={currentUser}
            updateProfile={updateUserProfile}
            deleteAccount={deleteUserAccount}
          />
        </div>

        {/* Profile Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ProfilePreview user={currentUser} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSettingsPage;

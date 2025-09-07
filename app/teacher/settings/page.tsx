import { getCurrentTeacher } from "@/app/data/teacher/get-current-teacher";
import { updateTeacherProfile } from "@/app/data/teacher/update-teacher-profile";
import { deleteTeacherAccount } from "@/app/data/teacher/delete-teacher-account";
import { TeacherProfileForm } from "./_components/TeacherProfileForm";
import { TeacherProfilePreview } from "./_components/TeacherProfilePreview";

const TeacherSettingsPage = async () => {
  const currentTeacher = await getCurrentTeacher();

  if (!currentTeacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold text-muted-foreground">
          Please sign in as a teacher to access settings
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Teacher Settings</h1>
        <p className="text-muted-foreground">
          Manage your teacher account settings and profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <TeacherProfileForm
            teacher={currentTeacher}
            updateProfile={updateTeacherProfile}
            deleteAccount={deleteTeacherAccount}
          />
        </div>

        {/* Profile Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <TeacherProfilePreview teacher={currentTeacher} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherSettingsPage;

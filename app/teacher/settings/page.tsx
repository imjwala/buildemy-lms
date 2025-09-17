import { getCurrentTeacher } from "@/app/data/teacher/get-current-teacher";
import { TeacherProfileForm } from "./_components/TeacherProfileForm";
import { TeacherProfilePreview } from "./_components/TeacherProfilePreview";
import { safeUpdateTeacherProfile, safeDeleteTeacherAccount } from "@/app/action/teacher-action"

const TeacherSettingsPage = async () => {
  const currentTeacher = await getCurrentTeacher();

  if (!currentTeacher) {
    return <div> Please sign in as a teacher to access settings </div>;
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
        <div className="lg:col-span-2">
          <TeacherProfileForm
            teacher={currentTeacher}
            updateProfile={safeUpdateTeacherProfile}
            deleteAccount={safeDeleteTeacherAccount}
          />
        </div>

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

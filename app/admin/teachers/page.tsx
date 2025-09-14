import { adminGetTeachers } from "@/app/data/admin/admin-get-teachers";
import { TeacherTable } from "./_components/TeacherTable";
import { EmptyState } from "@/components/general/EmptyState";

const TeachersPage = async () => {
  const teachers = await adminGetTeachers();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            Manage all teachers in your platform
          </p>
        </div>
      </div>

      {teachers.length === 0 ? (
        <EmptyState
          title="No Teachers Found"
          description="There are no teachers registered on the platform yet."
          buttonText="View Dashboard"
          href="/admin"
        />
      ) : (
        <TeacherTable teachers={teachers} />
      )}
    </>
  );
};

export default TeachersPage;

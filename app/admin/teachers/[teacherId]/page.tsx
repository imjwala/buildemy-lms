import { adminGetTeacher } from "@/app/data/admin/admin-get-teacher";
import { TeacherProfileCard } from "../_components/TeacherProfileCard";
import { TeacherCoursesList } from "../_components/TeacherCoursesList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TeacherDetailPageProps {
  params: Promise<{
    teacherId: string;
  }>;
}

const TeacherDetailPage = async ({ params }: TeacherDetailPageProps) => {
  const { teacherId } = await params;
  const teacher = await adminGetTeacher(teacherId);

  return (
    <>
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href="/admin/teachers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Teachers</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            {teacher.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Teacher Profile & Courses
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Teacher Profile Card - Responsive column span */}
        <div className="md:col-span-2 xl:col-span-1">
          <div className="sticky top-6">
            <TeacherProfileCard teacher={teacher} />
          </div>
        </div>

        {/* Courses List - Responsive column span */}
        <div className="md:col-span-2 xl:col-span-3">
          <TeacherCoursesList teacher={teacher} />
        </div>
      </div>
    </>
  );
};

export default TeacherDetailPage;

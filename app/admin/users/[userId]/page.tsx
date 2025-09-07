import { adminGetUser } from "@/app/data/admin/admin-get-user";
import { UserProfileCard } from "../_components/UserProfileCard";
import { UserCoursesList } from "../_components/UserCoursesList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserDetailPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserDetailPage = async ({ params }: UserDetailPageProps) => {
  const { userId } = await params;
  const user = await adminGetUser(userId);

  return (
    <>
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Users</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            {user.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            User Profile & Enrolled Courses
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* User Profile Card - Responsive column span */}
        <div className="md:col-span-2 xl:col-span-1">
          <div className="sticky top-6">
            <UserProfileCard user={user} />
          </div>
        </div>

        {/* Enrolled Courses List - Responsive column span */}
        <div className="md:col-span-2 xl:col-span-3">
          <UserCoursesList user={user} />
        </div>
      </div>
    </>
  );
};

export default UserDetailPage;

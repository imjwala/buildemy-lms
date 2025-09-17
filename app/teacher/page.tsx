import { SectionCards } from "@/components/sidebar/teacher-section-cards";
import { teacherGetEnrollmentStats } from "../data/teacher/teacher-get-enrollment-stats";
import { teacherGetDashboardStats } from "../data/teacher/teacher-get-dashboard-stats";
import { teacherGetRecentCourses } from "../data/teacher/teacher-get-recent-courses";
import { getCurrentUser } from "../data/user/get-current-user";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import {
  TeacherCourseCard,
  TeacherCourseCardSkeleton,
} from "./courses/_components/TeacherCourseCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function TeacherIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.emailVerified) redirect(`/verify-request?email=${user.email}`);

  const [enrollmentData, dashboardStats, recentCourses] = await Promise.all([
    teacherGetEnrollmentStats(),
    teacherGetDashboardStats(),
    teacherGetRecentCourses(),
  ]);

  // Helper: render recent courses
  const RenderRecentCourses = () => {
    if (recentCourses.length === 0) {
      return (
        <EmptyState
          buttonText="Create a new Course"
          description="You haven't created any courses yet. Create some to see them here."
          title="You dont have any Courses yet!"
          href="/teacher/courses/create"
        />
      );
    }

    return (
      <div className="relative px-12">
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {recentCourses.map((course) => (
              <CarouselItem key={course.id} className="md:basis-1/2">
                <TeacherCourseCard data={course} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  };

  // Helper: skeleton layout
  const RenderRecentCoursesSkeletonLayout = () => (
    <div className="relative px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <TeacherCourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your teaching activity.
        </p>
      </div>

      <SectionCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>
              Student enrollments in your courses over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollmentData.reduce((sum, day) => sum + day.enrollments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total enrollments this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>
              Overview of your course statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Courses:</span>
                <span className="font-medium">{dashboardStats.totalCourses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Lessons:</span>
                <span className="font-medium">{dashboardStats.totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Enrollments:</span>
                <span className="font-medium">{dashboardStats.totalEnrollments}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/teacher/courses"
          >
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </div>
  );
}

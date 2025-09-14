import { EmptyState } from "@/components/general/EmptyState";
import { getEnrolledCourses } from "../../data/user/get-enrolled-courses";
import { CourseProgressCard } from "../_components/CourseProgressCard";

const UserCoursesPage = async () => {
  const enrolledCourses = await getEnrolledCourses();

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have enrolled in and track your
          progress.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No Courses Enrolled"
          description="You haven't enrolled in any courses yet. Browse our course catalog to get started."
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.Course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
};

export default UserCoursesPage;

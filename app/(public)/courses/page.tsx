import { getAllCourses, PublicCourseType } from "@/app/data/course/get-all-courses";
import CoursesList from "./CoursesList";

export default async function PublicCoursesPage() {
  // Fetch all courses on the server
  const courses: PublicCourseType[] = await getAllCourses();

  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your learning goals.
        </p>
      </div>

      {/* Client-side component for search */}
      <CoursesList initialCourses={courses} />
    </div>
  );
}

import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import { BookX } from "lucide-react";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const CourseSlugRoute = async ({ params, children }: iAppProps) => {
  const { slug } = await params;
  const courseData = await getCourseSidebarData(slug);

  if (!courseData?.course) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        <BookX className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the course you're looking for.
        </p>
      </div>
    );
  }
  
  const firstLesson = courseData.course?.chapter?.[0]?.lessons?.[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-6">
      <BookX className="w-20 h-20 text-muted-foreground/50" />
      <h2 className="text-3xl font-bold">No Lessons Yet</h2>
      <p className="text-lg text-muted-foreground">
        This course is being prepared. Please check back soon for new content!
      </p>
    </div>
  );
};

export default CourseSlugRoute;
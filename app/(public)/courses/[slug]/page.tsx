import Image from "next/image";
import { getIndividualCourse } from "@/app/data/course/get-course";
import { getCourseEnrollments } from "@/app/data/course/get-course-enrollments";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
  IconUsers,
  IconCoins,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import { checkifCourseBought } from "@/app/data/user/user-is-enrolled";
import { getCurrentUser } from "@/app/data/user/get-current-user";
import { EnrollmentButton } from "./_components/EnrollmentButton";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { getRecommendedCourses } from "@/app/data/course/get-recommended-course";
import { PublicCourseCard } from "../../_components/PublicCourseCard";

interface iAppProps {
  params: Promise<{
    slug: string;
  }>;
}

const SlugPage = async ({ params }: iAppProps) => {
  const { slug } = await params;

  const course = await getIndividualCourse(slug);
  const enrollmentData = await getCourseEnrollments(course.id);
  const currentUser = await getCurrentUser();

  const thumbnailUrl = useConstructUrl(course.filekey);

  const isEnrolled = await checkifCourseBought(course.id);

  // Check if user can enroll (must have "user" role)
  const canEnroll = currentUser?.role === "user";

    const recommendedCourses = await getRecommendedCourses(
    course.category,
    course.id
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Description
            </h2>

            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapter.length} chapters |{" "}
              {course.chapter.reduce(
                (total, chapter) => total + chapter.lessons.length,
                0
              ) || 0}{" "}
              Lessons
            </div>
          </div>

          <div className="space-y-6">
            {course.chapter.map((chapter, index) => (
              <Collapsible key={chapter.id} defaultOpen={index === 0}>
                <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                  <CollapsibleTrigger>
                    <div>
                      <CardContent className="p-6 hover:bg-muted/50 trnasition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                              {index + 1}
                            </p>

                            <div>
                              <h3 className="text-xl font-semibold text-left">
                                {chapter.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 text-left">
                                {chapter.lessons.length} lesson
                                {chapter.lessons.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {chapter.lessons.length} lesson
                              {chapter.lessons.length !== 1 ? "s" : ""}
                            </Badge>
                            <IconChevronDown className="size-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t bg-muted-foreground/10">
                      <div className="p-6 pt-4 space-y-3">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent/40 transition-colors group"
                          >
                            <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                              <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>

                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {lesson.title}
                              </p>

                              <p className="text-sx text-muted-foreground mt-1">
                                Lesson {lessonIndex + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
         {/*  Recommended Courses */}
        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Recommended Courses
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {recommendedCourses.map((rec) => (
                <PublicCourseCard key={rec.id} data={rec} />
              ))}
            </div>
          </div>
        )}


        {/* Course Owner Enrollment Statistics */}
        {enrollmentData?.isOwner && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold tracking-tight">
                Course Analytics
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconUsers className="size-4" />
                <span>Your Course Performance</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <IconUsers className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Enrollments
                      </p>
                      <p className="text-2xl font-bold">
                        {enrollmentData.totalEnrollments}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      <IconCoins className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(enrollmentData.totalRevenue / 100)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                      <IconChartBar className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Students
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          enrollmentData.enrollments.filter(
                            (e) => e.status === "Active"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {enrollmentData.enrollments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconUsers className="size-5" />
                    Student Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Enrolled Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollmentData.enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">
                            {enrollment.User.name || "Unknown"}
                          </TableCell>
                          <TableCell>{enrollment.User.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enrollment.status === "Active"
                                  ? "default"
                                  : enrollment.status === "Pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(enrollment.amount / 100)}
                          </TableCell>
                          <TableCell>
                            {new Date(enrollment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}


      </div>
      

      {/* Enrollment Card */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Price:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(course.price)}
                </span>
              </div>

              <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                <h4 className="font-medium">What you will get:</h4>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Course Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {course.duration} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconChartBar />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Difficulty Level</p>
                      <p className="text-sm text-muted-foreground">
                        {course.level}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconCategory />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {course.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconBook />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Total Lessons</p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapter.reduce(
                          (total, chapter) => total + chapter.lessons.length,
                          0
                        ) || 0}{" "}
                        Lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <h4 className="">This course includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Full time access</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Certificate of Completion</span>
                  </li>
                </ul>
              </div>

              {isEnrolled ? (
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    className: "w-full",
                  })}
                >
                  Watch Course
                </Link>
              ) : (
                <EnrollmentButton
                  courseId={course.id}
                  disabled={!canEnroll}
                  disabledMessage={
                    !currentUser
                      ? "Please sign in to enroll"
                      : "Only users can enroll in courses"
                  }
                />
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SlugPage;

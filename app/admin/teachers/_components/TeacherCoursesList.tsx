"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminTeacherDetailType } from "@/app/data/admin/admin-get-teacher";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Clock,
  GraduationCap,
  Users,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EmptyState } from "@/components/general/EmptyState";

interface TeacherCoursesListProps {
  teacher: AdminTeacherDetailType;
}

export const TeacherCoursesList = ({ teacher }: TeacherCoursesListProps) => {
  if (teacher.courses.length === 0) {
    return (
      <EmptyState
        title="No Courses Created"
        description="This teacher hasn't created any courses yet."
        buttonText="View All Teachers"
        href="/admin/teachers"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Courses Created</h3>
        <Badge variant="secondary">
          {teacher.courses.length} course
          {teacher.courses.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacher.courses.map((course) => {
          const thumbnailUrl = useConstructUrl(course.filekey);
          const enrollmentCount = course.enrollment.length;

          return (
            <Card key={course.id} className="group relative">
              <div className="relative">
                <Image
                  src={thumbnailUrl}
                  alt={course.title}
                  width={400}
                  height={225}
                  className="w-full rounded-t-lg aspect-video object-cover"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={
                    course.status === "Published" ? "default" : "secondary"
                  }
                >
                  {course.status}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h4 className="font-semibold text-lg line-clamp-2 mb-2">
                  {course.title}
                </h4>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.smallDescription}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{course.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{enrollmentCount} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${course.price}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      Created:{" "}
                      {new Date(course.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    View Course Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

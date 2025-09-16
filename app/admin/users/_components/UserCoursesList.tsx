"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUserDetailType } from "@/app/data/admin/admin-get-user";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Calendar, Clock, DollarSign, ExternalLink, User } from "lucide-react";
import Link from "next/link";

interface UserCoursesListProps {
  user: AdminUserDetailType;
}

export const UserCoursesList = ({ user }: UserCoursesListProps) => {
  const isS3Key = (key: string) => key && !key.startsWith("http");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-orange-100 text-orange-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (user.enrollment.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This user hasn't enrolled in any courses yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Courses ({user.enrollment.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user.enrollment.map((enrollment) => {
            const course = enrollment.Course;
            const courseImageUrl = isS3Key(course.filekey)
              ? useConstructUrl(course.filekey)
              : course.filekey;

            return (
              <div
                key={enrollment.id}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Course Image */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <img
                    src={courseImageUrl || ""}
                    alt={course.title}
                    className="h-16 w-16 sm:h-16 sm:w-16 rounded-lg object-cover mx-auto sm:mx-0"
                  />
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold text-lg truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {course.smallDescription}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(enrollment.status)}
                        >
                          {enrollment.status}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getLevelColor(course.level)}
                        >
                          {course.level}
                        </Badge>
                        <Badge variant="outline">{course.status}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{course.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{course.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span>${enrollment.amount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        {new Date(enrollment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link href={`/courses/${course.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">View Course</span>
                      <span className="sm:hidden">View</span>
                    </Link>
                  </Button>
                  {/* {enrollment.status === "Active" && (
                    <Button variant="default" size="sm" asChild className="w-full sm:w-auto">
                      <Link href={`/dashboard/${course.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Go to Course</span>
                        <span className="sm:hidden">Go to</span>
                      </Link>
                    </Button>
                  )} */}
                  {/* <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link href={`/admin/courses/${course.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Manage</span>
                      <span className="sm:hidden">Manage</span>
                    </Link>
                  </Button> */}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

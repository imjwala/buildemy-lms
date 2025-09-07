"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminTeacherDetailType } from "@/app/data/admin/admin-get-teacher";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/date-utils";
import {
  Calendar,
  Mail,
  BookOpen,
  Users,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import { DeleteTeacherDialog } from "./DeleteTeacherDialog";

interface TeacherProfileCardProps {
  teacher: AdminTeacherDetailType;
}

export const TeacherProfileCard = ({ teacher }: TeacherProfileCardProps) => {
  const isS3Key = teacher.image && !teacher.image.startsWith("http");
  const imageUrl = isS3Key
    ? useConstructUrl(teacher.image || "")
    : teacher.image;

  const totalEnrollments = teacher.courses.reduce(
    (sum, course) => sum + course.enrollment.length,
    0
  );

  const totalRevenue = teacher.courses.reduce(
    (sum, course) => sum + course.price * course.enrollment.length,
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Teacher Profile</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <DeleteTeacherDialog
                  teacherId={teacher.id}
                  teacherName={teacher.name}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Image and Basic Info */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={imageUrl || ""} alt={teacher.name} />
              <AvatarFallback className="text-2xl">
                {teacher.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">{teacher.name}</h3>
            <p className="text-muted-foreground">{teacher.email}</p>
            <Badge variant="secondary" className="mt-2">
              Teacher
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Courses</p>
              <p className="text-2xl font-bold">{teacher.courses.length}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrollments</p>
              <p className="text-2xl font-bold">{totalEnrollments}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="text-sm font-medium">
                {formatDate(teacher.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{teacher.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

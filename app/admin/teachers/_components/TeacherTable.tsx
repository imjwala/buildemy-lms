"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminTeacherType } from "@/app/data/admin/admin-get-teachers";
import { Eye } from "lucide-react";
import Link from "next/link";

interface TeacherTableProps {
  teachers: AdminTeacherType[];
}

export const TeacherTable = ({ teachers }: TeacherTableProps) => {
  if (teachers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No teachers found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={teacher.image || ""} alt={teacher.name} />
                    <AvatarFallback>
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">{teacher.email}</p>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {teacher.courses.length} course
                  {teacher.courses.length !== 1 ? "s" : ""}
                </Badge>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {new Date(teacher.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/teachers/${teacher.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

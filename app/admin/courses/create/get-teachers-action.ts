"use server";

import {
  adminGetTeachersForCourse,
  AdminTeacherForCourseType,
} from "@/app/data/admin/admin-get-teachers-for-course";

export async function getTeachersAction(): Promise<
  | {
      success: true;
      data: AdminTeacherForCourseType[];
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const teachers = await adminGetTeachersForCourse();
    return { success: true, data: teachers };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return { success: false, error: "Failed to fetch teachers" };
  }
}

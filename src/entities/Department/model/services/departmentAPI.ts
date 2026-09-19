import $api_edu from "shared/api/api_edu";
import {
  Department,
  DepartmentTeacher,
  DepartmentTeacherCourse,
} from "../types/department";

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.results)) return record.results as T[];
    if (Array.isArray(record.items)) return record.items as T[];
    if (Array.isArray(record.data)) return record.data as T[];
  }
  return [];
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await $api_edu.get("departments/");
  return unwrapList<Department>(response.data);
};

export const getDepartmentTeachers = async (
  organizationId: string
): Promise<DepartmentTeacher[]> => {
  const response = await $api_edu.get(
    `departments/${organizationId}/teachers/`
  );
  return unwrapList<DepartmentTeacher>(response.data);
};

export const getDepartmentTeacherCourses = async (
  organizationId: string,
  teacherId: number
): Promise<DepartmentTeacherCourse[]> => {
  const response = await $api_edu.get(
    `departments/${organizationId}/teachers/${teacherId}/courses/`
  );
  return unwrapList<DepartmentTeacherCourse>(response.data);
};

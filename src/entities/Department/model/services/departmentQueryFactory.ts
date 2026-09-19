import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import {
  getDepartments,
  getDepartmentTeacherCourses,
  getDepartmentTeachers,
} from "./departmentAPI";

function retryUnlessClientError(failureCount: number, error: unknown) {
  if (
    axios.isAxiosError(error) &&
    [401, 403, 404].includes(error.response?.status ?? 0)
  ) {
    return false;
  }
  return failureCount < 2;
}

export const departmentQueries = {
  list: () =>
    queryOptions({
      queryKey: ["departments"],
      queryFn: getDepartments,
      retry: retryUnlessClientError,
    }),
  teachers: (organizationId: string | null) =>
    queryOptions({
      queryKey: ["departments", organizationId, "teachers"],
      queryFn: () => getDepartmentTeachers(organizationId as string),
      enabled: Boolean(organizationId),
      retry: retryUnlessClientError,
    }),
  teacherCourses: (organizationId: string | null, teacherId: number | null) =>
    queryOptions({
      queryKey: [
        "departments",
        organizationId,
        "teachers",
        teacherId,
        "courses",
      ],
      queryFn: () =>
        getDepartmentTeacherCourses(
          organizationId as string,
          teacherId as number
        ),
      enabled: Boolean(organizationId) && teacherId != null,
      retry: retryUnlessClientError,
    }),
};

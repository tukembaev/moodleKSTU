import { queryOptions } from "@tanstack/react-query";

import {
  useCreateTest,
  useCreateTestWithFormData,
  useAttachTestToCourse,
  useUpdateTest,
  useUpdateTestWithFormData,
  useSetTestAvailability,
  useDeleteTest,
  useResetTestResult,
} from "features/Test/model/services/test_queries";
import { getAllTest, getTestQuestions, getTestResults } from "./testAPI";

export const testQueries = {
  allTest: (courseId?: string) =>
    queryOptions({
      queryKey: ["test", courseId ? { courseId } : "bank"],
      queryFn: () => getAllTest(courseId),
    }),
  TestResult: (testId: string | null, courseId: string | null) =>
    queryOptions({
      queryKey: ["test", "result", testId, courseId],
      queryFn: () => getTestResults(testId, courseId),
      enabled: !!testId && !!courseId,
    }),
  TestQuestions: (id: string | null) =>
    queryOptions({
      queryKey: ["test", "questions", id],
      queryFn: () => getTestQuestions(id as string),
      enabled: !!id,
    }),
  create_test: () => useCreateTest(),
  create_test_with_formdata: () => useCreateTestWithFormData(),
  attach_test_to_course: () => useAttachTestToCourse(),
  update_test: () => useUpdateTest(),
  update_test_with_formdata: () => useUpdateTestWithFormData(),
  set_availability: () => useSetTestAvailability(),
  delete_test: () => useDeleteTest(),
  reset_result: () => useResetTestResult(),
};

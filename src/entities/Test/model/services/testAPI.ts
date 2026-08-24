import $api_edu from "shared/api/api_edu";
import { Test, TestDetails, TestResult, TestSubmissionPayload, TestSubmissionResponse } from "../types/test";
import { TestPayload } from "features/Test/model/types/test_payload";

export const getAllTest = async (courseId?: string): Promise<Test[]> => {
  const response = await $api_edu.get(`testing/`, {
    params: courseId ? { course_id: courseId } : undefined,
  });
  return response.data;
};

export const getTestQuestions = async (id: string | null): Promise<TestDetails> => {
  const response = await $api_edu.get(`testing/${id}/`);
  return response.data;
};

export const getTestResults = async (testId: string | null, courseId: string | null): Promise<TestResult[]> => {
  if (!testId || !courseId) {
    throw new Error("testId and courseId are required");
  }
  const response = await $api_edu.get(`results/${testId}/${courseId}/`);
  return response.data;
};

export const createTest = async (data: TestPayload) => {
  const response = await $api_edu.post(`testing/`, data);
  return response.data;
};

export const createTestWithFormData = async (formData: FormData): Promise<TestDetails> => {
  const response = await $api_edu.post(`testing/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateTest = async (id: string, data: unknown): Promise<TestDetails> => {
  const response = await $api_edu.put(`testing/${id}/`, data);
  return response.data;
};

export const updateTestWithFormData = async (id: string, formData: FormData): Promise<TestDetails> => {
  const response = await $api_edu.put(`testing/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const submitTestAnswers = async (
  testId: string,
  data: TestSubmissionPayload
): Promise<TestSubmissionResponse> => {
  const response = await $api_edu.post(`tests/${testId}/submit/`, data);
  return response.data;
};

export interface AttachTestToCoursePayload {
  test_id: string;
  course_id: string;
}

export interface AttachTestToCourseResponse {
  message: string;
  course_id: string;
  test_id: string;
  is_open: boolean;
}

export const attachTestToCourse = async (
  data: AttachTestToCoursePayload
): Promise<AttachTestToCourseResponse> => {
  const response = await $api_edu.post(`tests/attach-to-course/`, data);
  return response.data;
};

export interface SetTestAvailabilityPayload {
  test_id: string;
  course_id: string;
  is_open: boolean;
}

export interface SetTestAvailabilityResponse {
  test_id: string;
  course_id: string;
  is_open: boolean;
}

export const setTestAvailability = async (
  data: SetTestAvailabilityPayload
): Promise<SetTestAvailabilityResponse> => {
  const response = await $api_edu.patch(`tests/${data.test_id}/availability/`, {
    course_id: data.course_id,
    is_open: data.is_open,
  });
  return response.data;
};

export const deleteTest = async (testId: string): Promise<void> => {
  await $api_edu.delete(`testing/${testId}/`);
};

export interface ResetTestResultPayload {
  test_id: string;
  student_id: number;
  course_id: string;
}

export interface ResetTestResultResponse {
  message: string;
  test_id: string;
  student_id: number;
  course_id: string;
}

export const resetTestResult = async (
  data: ResetTestResultPayload
): Promise<ResetTestResultResponse> => {
  const response = await $api_edu.post(`tests/${data.test_id}/reset-result/`, {
    student_id: data.student_id,
    course_id: data.course_id,
  });
  return response.data;
};

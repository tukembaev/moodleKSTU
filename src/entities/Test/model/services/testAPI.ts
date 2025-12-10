import $api_edu from "shared/api/api_edu";
import { Test, TestDetails, TestResult, TestSubmissionPayload, TestSubmissionResponse } from "../types/test";
import { TestPayload } from "features/Test/model/types/test_payload";

export const getAllTest = async (query: string): Promise<Test[]> => {
  const response = await $api_edu.get(`testing${query}`);
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

export const createTestWithFormData = async (formData: FormData) => {
  const response = await $api_edu.post(`testing/`, formData, {
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

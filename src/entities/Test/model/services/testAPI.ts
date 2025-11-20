import $api_edu from "shared/api/api_edu";
import { Test, TestResult } from "../types/test";
import { TestPayload } from "features/Test/model/types/test_payload";

export const getAllTest = async (query:string):Promise<Test[]> => {
    const response = await $api_edu.get(`testing/${query}`); 
    return response.data;
  };

export const getTestResults = async (id: string | null):Promise<TestResult[]> => {
    const response = await $api_edu.get(`results/${id}`); 
    return response.data;
  };

export const createTest = async (data: TestPayload) => {
    const response = await $api_edu.post(`testing`, data);
    return response.data;
  };

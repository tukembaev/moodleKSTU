import { queryOptions } from '@tanstack/react-query';


import { useCreateTest, useCreateTestWithFormData } from 'features/Test/model/services/test_queries';
import { getAllTest, getTestQuestions, getTestResults } from './testAPI';

export const testQueries = {
  //----------GET QUERIES------------
  allTest: (query: string) =>
    queryOptions({
      queryKey: ['test'],
      queryFn: () => getAllTest(query),
    }),
  TestResult: (testId: string | null, courseId: string | null) =>
    queryOptions({
      queryKey: ['test', 'result', testId, courseId],
      queryFn: () => getTestResults(testId, courseId),
      enabled: !!testId && !!courseId,
    }),
  TestQuestions: (id: string | null) =>
    queryOptions({
      queryKey: ['test', 'questions'],
      queryFn: () => getTestQuestions(id as string),
      enabled: !!id,
    }),
  //----------POST QUERIES------------
  create_test: () => useCreateTest(),
  create_test_with_formdata: () => useCreateTestWithFormData(),
};

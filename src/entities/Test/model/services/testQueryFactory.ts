import { queryOptions } from '@tanstack/react-query';


import { useCreateTest } from 'features/Test/model/services/test_queries';
import { getAllTest, getTestResults } from './testAPI';

export const testQueries = {
  //----------GET QUERIES------------
    allTest: (query:string) =>
    queryOptions({
      queryKey: ['test'],
      queryFn: () => getAllTest(query),
    }),
    TestResult: (id: string | null) =>
      queryOptions({
        queryKey: ['test','result'],
        queryFn: () => getTestResults(id as string),
        enabled: !!id,
      }),
  //----------POST QUERIES------------
  create_test: () => useCreateTest(),
};

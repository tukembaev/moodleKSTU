import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getProfessorsOfDepartment, getUniversityList } from './universityAPI';


export const universityQueries = {
  // all: () => ['institutes-dep'],

  allCourses: () =>
    queryOptions({
      queryKey: ['institutes-dep'],
      queryFn: getUniversityList,
      placeholderData: keepPreviousData,
    }),

  getProfessors: (id: number | null) =>
    queryOptions({
      queryKey: ['department-employees', id],
      queryFn: () => getProfessorsOfDepartment(id as number),
      enabled: !!id,
    }),


};

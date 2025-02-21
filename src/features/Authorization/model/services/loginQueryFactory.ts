import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { getPeople, getPerson, PersonData, postPerson } from './loginAPI';

export const swapiQueries = {
  all: () => ['swapi', 'people'],

  allPeople: () =>
    queryOptions({
      queryKey: swapiQueries.all(),
      queryFn: getPeople,
      placeholderData: keepPreviousData,
  
    }),

  person: (id: number | string) =>
    queryOptions({
      queryKey: [...swapiQueries.all(), id],
      queryFn: () => getPerson({ id }),

    }),

  createPerson: (data: PersonData) => postPerson(data),
};

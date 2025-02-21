import axios from 'axios';
import $api from 'shared/api/api';

export interface PersonData {
  name: string;
  birth_year: string;
  gender: string;
}

export const getPeople = async () => {
  const { data } = await $api.get('api/people/');
  return data.results;
};

export const getPerson = async ({ id }: { id: number | string }) => {
  if (!id) throw new Error('Id is required');
  const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
  return response.data;
};

export const postPerson = async (data: PersonData) => {
  const response = await axios.post('https://example.com/api/people', data); // замените на реальный URL
  return response.data;
};
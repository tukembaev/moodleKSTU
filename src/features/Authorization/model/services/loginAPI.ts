
import axios from 'axios';


export interface PersonData {
  email: string;
  password: string;
}
const auth_data = JSON.parse(localStorage.getItem("auth_data") || "{}");


export const authUser = async (data: PersonData) => {
  const response = await axios.post('http://localhost:8000/api/v1/users/auth/', data);
  return response.data;
};


export const refreshUser = async () => {
  if (!auth_data || !auth_data.refresh) {
    throw new Error("No refresh token available");
  }
  const response = await axios.post("http://localhost:8000/api/v1/users/refresh/", {
    refresh: auth_data.refresh,
  });
  return response.data;
};


// export const getPerson = async ({ id }: { id: number | string }) => {
//   if (!id) throw new Error('Id is required');
//   const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
//   return response.data;
// };

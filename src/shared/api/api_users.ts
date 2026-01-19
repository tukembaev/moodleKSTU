
import axios from "axios"
import { refreshUser } from "features/Authorization/model/services/loginAPI";


export const API_URL = `http://127.0.0.1:8000//api/v1/users/`


const auth_data = JSON.parse(localStorage.getItem("auth_data") || "{}");


export const $api_users = axios.create({
  // withCredentials: true,
  baseURL: API_URL,
})

$api_users.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${auth_data.access}`
  return config
})
$api_users.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access in api.ts");
      try {
        const newTokens = await refreshUser();
        const authData = JSON.parse(localStorage.getItem("auth_data") || "{}");
        const updatedAuthData = { ...authData, access: newTokens.access };
        localStorage.setItem("auth_data", JSON.stringify(updatedAuthData));
        window.dispatchEvent(new Event("storage"));
        error.config.headers.Authorization = `Bearer ${newTokens.access}`;
        return axios.request(error.config);
      } catch (refreshError) {

        console.error("Refresh token failed, logging out...", refreshError);
        localStorage.setItem("refresh_error", 'Refresh токен устарел, перезайдите в систему');
        // localStorage.removeItem("auth_data");
        // window.location.href = "/";
        // BUG: сделать ошибку в loginForm 

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default $api_users

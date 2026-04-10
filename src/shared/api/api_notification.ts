import axios from "axios"
import { refreshUser } from "features/Authorization/model/services/loginAPI";

export const API_URL = `https://uadmin.kstu.kg/edu-service/`


export const $api_notification = axios.create({
    baseURL: API_URL,
})

$api_notification.interceptors.request.use((config) => {
    const auth_data_current = JSON.parse(localStorage.getItem("auth_data") || "{}");
    config.headers.Authorization = `Bearer ${auth_data_current.access}`
    return config
})

$api_notification.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized access in api_notification.ts");
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
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default $api_notification

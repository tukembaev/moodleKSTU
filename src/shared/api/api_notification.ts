import axios from "axios";
import { API_NOTIFICATION_URL as API_URL } from "./config";
import { attachAuthInterceptors } from "shared/lib/auth";

export { API_URL };

export const $api_notification = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

attachAuthInterceptors($api_notification);

export default $api_notification;

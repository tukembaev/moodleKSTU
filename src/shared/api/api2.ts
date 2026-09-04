import axios from "axios";
import { API_URL } from "./config";
import { attachAuthInterceptors } from "shared/lib/auth";

export { API_URL };

export const $api2 = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

attachAuthInterceptors($api2);

export default $api2;

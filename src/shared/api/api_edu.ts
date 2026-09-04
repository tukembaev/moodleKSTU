import axios from "axios";
import { API_EDU_URL as API_URL } from "./config";
import { attachAuthInterceptors } from "shared/lib/auth";

export { API_URL };

export const $api_edu = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

attachAuthInterceptors($api_edu);

export default $api_edu;

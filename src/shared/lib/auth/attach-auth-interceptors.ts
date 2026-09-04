import { AxiosInstance } from "axios";
import { attachAuthRequestInterceptor } from "./axios-request-auth";
import { attachRefreshInterceptor } from "./axios-auth-refresh";

/** withCredentials + profile context + CSRF + 401 refresh */
export function attachAuthInterceptors(instance: AxiosInstance) {
  attachAuthRequestInterceptor(instance);
  attachRefreshInterceptor(instance);
}

import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  getActiveContext,
  getCsrfToken,
} from "./auth-storage";
import { API_USERS_SERVICE_URL } from "shared/api/config";

const WRITE_METHODS = new Set(["post", "put", "patch", "delete"]);

function isUsersServiceRequest(config: InternalAxiosRequestConfig): boolean {
  const base = config.baseURL || "";
  const url = config.url || "";
  const full = `${base}${url}`;
  return (
    full.includes("/users/api/") ||
    base.includes(API_USERS_SERVICE_URL) ||
    base.startsWith(API_USERS_SERVICE_URL)
  );
}

function isAuthLoginRequest(config: InternalAxiosRequestConfig): boolean {
  const url = `${config.baseURL || ""}${config.url || ""}`;
  return /users\/auth(\/google)?\/?$/.test(url) || /users\/auth\/?$/.test(url);
}

export function attachAuthRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    config.withCredentials = true;

    if (!isAuthLoginRequest(config)) {
      const context = getActiveContext();
      if (context) {
        config.headers["X-Profile-Context"] = context;
      }
    }

    const method = (config.method || "get").toLowerCase();
    if (WRITE_METHODS.has(method) && isUsersServiceRequest(config)) {
      const csrf = getCsrfToken();
      if (csrf) {
        config.headers["X-CSRF-TOKEN"] = csrf;
        config.headers["x-csrf-token"] = csrf;
      }
    }

    return config;
  });
}

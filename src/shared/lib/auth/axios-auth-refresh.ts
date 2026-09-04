import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { refreshSession } from "./refresh-token";
import { performLogout } from "./logout";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function isAuthEndpoint(config?: InternalAxiosRequestConfig): boolean {
  if (!config) return false;
  const url = `${config.baseURL || ""}${config.url || ""}`;
  return (
    /users\/auth(\/google|\/logout|\/context|\/contexts)?\/?$/.test(url) ||
    /users\/refresh\/?$/.test(url) ||
    /forgot-password/.test(url)
  );
}

export function attachRefreshInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as RetriableConfig | undefined;
      const status = error.response?.status;

      if (
        status !== 401 ||
        !original ||
        original._retry ||
        isAuthEndpoint(original)
      ) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        await refreshSession();
        original.withCredentials = true;
        return instance.request(original);
      } catch (refreshError) {
        await performLogout({ redirect: true });
        return Promise.reject(refreshError);
      }
    }
  );
}

import { API_TARGET } from "./api-target";

const PROD_EDU_ORIGIN = "https://uadmin.kstu.kg/educations";
const PROD_NOTIFICATION_ORIGIN = "https://uadmin.kstu.kg/edu-service";
const PROD_USERS_SERVICE_ORIGIN = "https://uadmin.kstu.kg/users/api/v1/";

const explicitHost = import.meta.env.VITE_API_HOST as string | undefined;
const explicitUsersService = import.meta.env.VITE_USERS_API_HOST as
  | string
  | undefined;

function resolveApiHost(): string {
  if (explicitHost !== undefined) return explicitHost;

  if (API_TARGET === "local") {
    // Пустая строка → относительные URL `/api/...`, Vite проксирует на :8005
    return "";
  }

  return PROD_EDU_ORIGIN;
}

export const API_HOST = resolveApiHost();

export const API_URL = `${API_HOST}/api/`;
export const API_EDU_URL = `${API_HOST}/api/v1/edu/`;
/** LMS educations users endpoints (профили курсов и т.п.) */
export const API_USERS_URL = `${API_HOST}/api/v1/users/`;

/** Shared UNET users-service (cookie SSO) */
export const API_USERS_SERVICE_URL =
  explicitUsersService || PROD_USERS_SERVICE_ORIGIN;

export const API_NOTIFICATION_URL = `${PROD_NOTIFICATION_ORIGIN}/`;

export const GOOGLE_AUTH_URL = `${API_USERS_SERVICE_URL}users/auth/google`;

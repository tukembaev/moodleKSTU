const PROD_EDU_ORIGIN = "https://uadmin.kstu.kg/educations";
const PROD_NOTIFICATION_ORIGIN = "https://uadmin.kstu.kg/edu-service";

/**
 * Local Django origin. In DEV the browser calls same-origin `/api/...`
 * and Vite proxies it here (Django on :8005 does not send CORS headers).
 * Override with VITE_API_HOST if CORS is enabled on the backend.
 */
export const LOCAL_DJANGO_ORIGIN = "http://localhost:8005";

const explicitHost = import.meta.env.VITE_API_HOST as string | undefined;

export const API_HOST =
  explicitHost ?? (import.meta.env.DEV ? "" : PROD_EDU_ORIGIN);

export const API_URL = `${API_HOST}/api/`;
export const API_EDU_URL = `${API_HOST}/api/v1/edu/`;
export const API_USERS_URL = `${API_HOST}/api/v1/users/`;

export const API_NOTIFICATION_URL = `${PROD_NOTIFICATION_ORIGIN}/`;

export const GOOGLE_AUTH_URL = `${API_HOST}/api/employees/auth/google/`;

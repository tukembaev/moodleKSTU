import axios from "axios";
import { API_USERS_SERVICE_URL } from "shared/api/config";
import {
  clearAuthStorage,
  getCsrfToken,
  notifyAuthChanged,
} from "./auth-storage";

type LogoutOptions = {
  redirect?: boolean;
  redirectTo?: string;
};

export async function performLogout(options: LogoutOptions = {}) {
  const { redirect = false, redirectTo = "/" } = options;

  try {
    const csrf = getCsrfToken();
    await axios.post(
      `${API_USERS_SERVICE_URL}users/auth/logout`,
      undefined,
      {
        withCredentials: true,
        headers: csrf
          ? {
              "X-CSRF-TOKEN": csrf,
              "x-csrf-token": csrf,
            }
          : undefined,
      }
    );
  } catch {
    // Clear local session even if server logout fails
  }

  clearAuthStorage();
  notifyAuthChanged();

  if (redirect) {
    window.location.href = redirectTo;
  }
}

import axios from "axios";
import { API_USERS_SERVICE_URL } from "shared/api/config";
import { getRefreshCsrfToken, StoredUser } from "./auth-storage";
import { persistAuthSession } from "./parse-auth-login";

let refreshPromise: Promise<StoredUser> | null = null;

async function doRefresh(): Promise<StoredUser> {
  const csrf = getRefreshCsrfToken();
  const response = await axios.post(
    `${API_USERS_SERVICE_URL}users/refresh`,
    "",
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

  return persistAuthSession(response.data as StoredUser).user;
}

/** Single-flight refresh: parallel 401s share one refresh call. */
export function refreshSession(): Promise<StoredUser> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

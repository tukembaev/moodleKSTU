import { persistAuthSession } from "shared/lib/auth";
import { DecodedJWT } from "features/Authorization/model/types/login";

interface TokenResponse {
  access: string;
  refresh?: string;
  csrf_token?: string;
}

/** Legacy helper: decode JWT access and persist as cookie-era `user` session. */
export const saveToLocalStorageFromJWT = (tokens: TokenResponse) => {
  const decoded = JSON.parse(atob(tokens.access.split(".")[1])) as DecodedJWT;
  const userData = decoded.user_data;

  persistAuthSession({
    ...tokens,
    ...userData,
    id: userData.user,
    avatar: userData.imeag,
    isStudent: userData.role === "student",
    role: userData.role,
    active_context: userData.role === "student" ? "student" : "employee",
  });
};

import { DecodedJWT } from "features/Authorization/model/types/login";

interface TokenResponse {
  access: string;
  refresh: string;
}

export const saveToLocalStorageFromJWT = (
  tokens: TokenResponse,
  storageKey = "auth_data"
) => {
  const decoded = JSON.parse(atob(tokens.access.split(".")[1])) as DecodedJWT;

  const { first_name, last_name, imeag, user, position , role } = decoded.user_data;
  debugger
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...tokens,
      id: user,
      first_name,
      last_name,
      imeag,
      position,
      isStudent: role === 'student' ? true : false ,
    })
  );

  window.dispatchEvent(new Event("storage"));
};

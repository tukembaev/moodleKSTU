
import {
  authByGoogle,
  authByPassword,
  LoginCredentials,
  selectAuthContext,
  AuthContext,
} from "shared/lib/auth";
import { refreshSession } from "shared/lib/auth";

export type PersonData = LoginCredentials;

/** @deprecated use username — kept for gradual migration */
export interface LegacyPersonData {
  email: string;
  password: string;
}

export const authUser = async (data: LoginCredentials | LegacyPersonData) => {
  const username =
    "username" in data ? data.username : (data as LegacyPersonData).email;
  return authByPassword({ username, password: data.password });
};

export const refreshUser = async () => {
  return refreshSession();
};

export const setAuthContext = async (context: AuthContext) => {
  return selectAuthContext(context);
};

export const authGoogle = async (idToken: string) => {
  return authByGoogle(idToken);
};

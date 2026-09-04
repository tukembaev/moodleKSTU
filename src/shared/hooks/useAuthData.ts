import { useState, useEffect } from "react";
import {
  getActiveProfileContext,
  getStoredUser,
  hasAuthSession,
  isStudentFromUser,
  resolveUserId,
  splitFullName,
  StoredUser,
} from "shared/lib/auth";

export interface AuthData {
  id: number;
  avatar?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  isStudent: boolean;
  /** False for guest / EMPTY_AUTH placeholder */
  isAuthenticated: boolean;
  access?: string;
  refresh?: string;
  [key: string]: unknown;
}

/** Safe defaults so `const { isStudent } = useAuth()` never throws. */
export const EMPTY_AUTH: AuthData = {
  id: 0,
  isStudent: false,
  isAuthenticated: false,
  first_name: "",
  last_name: "",
  avatar: "",
  email: "",
  position: "",
};

function mapStoredUser(user: StoredUser | null): AuthData | null {
  if (!hasAuthSession(user)) return null;

  const active = getActiveProfileContext();
  const nested = (user?.user_data || {}) as StoredUser;
  const fromName = splitFullName(active?.full_name);

  const id = resolveUserId(user) ?? 0;

  return {
    ...user,
    id,
    isAuthenticated: true,
    first_name:
      (user?.first_name as string | undefined) ||
      (nested.first_name as string | undefined) ||
      fromName.first_name,
    last_name:
      (user?.last_name as string | undefined) ||
      (nested.last_name as string | undefined) ||
      fromName.last_name,
    email:
      (user?.email as string | undefined) ||
      (nested.email as string | undefined) ||
      "",
    position:
      (user?.position as string | undefined) ||
      (nested.position as string | undefined) ||
      active?.position ||
      "",
    avatar:
      (user?.avatar as string | undefined) ||
      (user?.imeag as string | undefined) ||
      (nested.avatar as string | undefined) ||
      (nested.imeag as string | undefined) ||
      active?.avatar_url ||
      "",
    isStudent: isStudentFromUser(user, active?.type ?? null),
    access: user?.access as string | undefined,
    refresh: user?.refresh as string | undefined,
  };
}

/**
 * Always returns an object (never null) so destructuring is safe.
 * Check `auth.isAuthenticated` for guest vs logged-in.
 */
export const useAuth = (): AuthData => {
  const [auth, setAuth] = useState<AuthData>(() => {
    if (typeof window === "undefined") return EMPTY_AUTH;
    return mapStoredUser(getStoredUser()) ?? EMPTY_AUTH;
  });

  useEffect(() => {
    const updateAuth = () => {
      setAuth(mapStoredUser(getStoredUser()) ?? EMPTY_AUTH);
    };

    window.addEventListener("storage", updateAuth);
    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  return auth;
};

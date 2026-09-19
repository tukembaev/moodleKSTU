import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getActiveContext, hasAuthSession } from "shared/lib/auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const authed = hasAuthSession() && Boolean(getActiveContext());

  if (!authed && !isLoginPage) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

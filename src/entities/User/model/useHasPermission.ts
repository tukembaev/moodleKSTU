import { useQuery } from "@tanstack/react-query";
import { useAuth } from "shared/hooks";
import { hasPermission } from "../lib/permissions";
import { userQueries } from "./userQueryFactory";

export function useHasPermission(permission: string) {
  const auth = useAuth();
  const enabled = auth.isAuthenticated;
  const { data: me, isPending } = useQuery({
    ...userQueries.me(),
    enabled,
  });

  return {
    hasAccess: hasPermission(me?.permissions, permission),
    isLoading: enabled && isPending,
  };
}

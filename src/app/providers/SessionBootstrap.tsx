import { useEffect, useState, type ReactNode } from "react";
import {
  getActiveContext,
  hasAuthSession,
  restoreSessionFromCookie,
} from "shared/lib/auth";
import { getPostLoginPath } from "shared/lib/navigation/hidden-ids";
import { Loader2 } from "lucide-react";

function hasGoogleOAuthHash() {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash;
  return hash.includes("id_token") || hash.includes("access_token");
}

/**
 * If another UNET app already authenticated the user (shared cookie),
 * hydrate local `user` before rendering the rest of the app.
 */
export function SessionBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      return false;
    }
    return hasAuthSession() && Boolean(getActiveContext());
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (hasGoogleOAuthHash()) {
        if (!cancelled) setReady(true);
        return;
      }

      const onLoginPage = window.location.pathname === "/";

      if (onLoginPage || !(hasAuthSession() && getActiveContext())) {
        try {
          const restored = await restoreSessionFromCookie();
          if (
            restored?.requiresContextSelection &&
            window.location.pathname !== "/"
          ) {
            window.location.replace("/");
            return;
          }
        } catch {
          // anonymous visitor
        }
      }

      if (
        window.location.pathname === "/" &&
        hasAuthSession() &&
        getActiveContext()
      ) {
        window.location.replace(getPostLoginPath());
        return;
      }

      if (!cancelled) setReady(true);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="h-dvh w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}

import { useEffect, useState, type ReactNode } from "react";
import {
  getActiveContext,
  hasAuthSession,
  restoreSessionFromCookie,
} from "shared/lib/auth";
import { Loader2 } from "lucide-react";

/**
 * If another UNET app already authenticated the user (shared cookie),
 * hydrate local `user` before rendering the rest of the app.
 */
export function SessionBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => {
    return hasAuthSession() && Boolean(getActiveContext());
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (hasAuthSession() && getActiveContext()) {
        setReady(true);
        return;
      }

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
      } finally {
        if (!cancelled) setReady(true);
      }
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

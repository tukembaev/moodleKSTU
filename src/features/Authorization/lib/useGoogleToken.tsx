import { useEffect, useState } from "react";
import { authByGoogle } from "shared/lib/auth";
import { getPostLoginPath } from "shared/lib/navigation/hidden-ids";

const GOOGLE_NONCE_KEY = "google_oauth_nonce";

function createNonce() {
  const nonce =
    crypto.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(GOOGLE_NONCE_KEY, nonce);
  return nonce;
}

function consumeNonce(expected?: string | null) {
  const stored = sessionStorage.getItem(GOOGLE_NONCE_KEY);
  sessionStorage.removeItem(GOOGLE_NONCE_KEY);
  if (!expected) return true;
  return stored === expected;
}

export const useGoogleToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const params = new URLSearchParams(hash.substring(1));
    const idToken = params.get("id_token");
    const accessToken = params.get("access_token");
    const nonce = params.get("nonce");
    const token = idToken || accessToken;

    if (!token) return;

    if (!consumeNonce(nonce)) {
      console.error("Google auth nonce mismatch");
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const result = await authByGoogle(token);
        window.history.replaceState(null, "", window.location.pathname);

        if (result.requiresContextSelection) {
          window.dispatchEvent(
            new CustomEvent("auth:needs-context", {
              detail: result.availableContexts,
            })
          );
          return;
        }

        window.location.href = getPostLoginPath();
      } catch (err) {
        console.error("Google auth error:", err);
        setError("Ошибка входа через Google");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const authenticate = () => {
    setLoading(true);
    const clientId =
      "1082367956142-ntu3usf4p07jpd1enjn7gj308a95qn4v.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/";
    const nonce = createNonce();
    const scope = ["openid", "email", "profile"];
    const scopeParam = encodeURIComponent(scope.join(" "));

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token%20token` +
      `&scope=${scopeParam}` +
      `&nonce=${encodeURIComponent(nonce)}` +
      `&include_granted_scopes=true` +
      `&prompt=select_account`;

    window.location.href = authUrl;
  };

  return { loading, error, authenticate };
};

import axios from "axios";
import { useEffect, useState } from "react";

interface UseGoogleTokenOptions {
  clientId: string;
  scope?: string[];
  enabled?: boolean;
}

interface GoogleTokens {
  access: string;
  refresh: string;
}

export const useGoogleToken = ({
  clientId,
  scope = ["openid", "profile", "email"],
  enabled = true,
}: UseGoogleTokenOptions) => {
  const [token, setToken] = useState<GoogleTokens | null>(() => {
    const stored = localStorage.getItem("google_auth");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleAuth = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");

      if (access_token) {
        try {
          const response = await axios.post(
            "https://uadmin.kstu.kg/api/employees/auth/google/",
            { token: access_token }
          );
          const tokens = {
            access: response.data.access,
            refresh: response.data.refresh,
          };

          localStorage.setItem("google_auth", JSON.stringify(tokens));
          setToken(tokens);

          window.history.replaceState(null, "", window.location.pathname);
        } catch (err) {
          console.error("Google auth error:", err);
        }
        return;
      }

      if (!token) {
        setLoading(true);
        const redirectUri = window.location.href;
        const scopeParam = encodeURIComponent(scope.join(" "));
        const authUrl =
          `https://accounts.google.com/o/oauth2/v2/auth` +
          `?client_id=${clientId}` +
          `&redirect_uri=${redirectUri}` +
          `&response_type=token` +
          `&scope=${scopeParam}` +
          `&include_granted_scopes=true` +
          `&prompt=consent`;
        window.location.href = authUrl;
      }
    };

    handleAuth();
  }, [enabled]);

  return { token, loading };
};

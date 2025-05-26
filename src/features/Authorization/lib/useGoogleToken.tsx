import axios from "axios";
import { useEffect, useState } from "react";
import { saveToLocalStorageFromJWT } from "shared/lib/decodeJWT";

interface GoogleTokens {
  access: string;
  refresh: string;
}

export const useGoogleToken = () => {
  const [token, setToken] = useState<GoogleTokens | null>(() => {
    const stored = localStorage.getItem("google_auth");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  // 👇 Обработка access_token из URL
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");

    if (access_token) {
      (async () => {
        try {
          const response = await axios.post(
            "https://utask.kstu.kg/api/employees/auth/google/",
            { token: access_token }
          );

          const tokens = {
            access: response.data.access,
            refresh: response.data.refresh,
          };

          localStorage.setItem("google_auth", JSON.stringify(tokens));
          setToken(tokens);

          saveToLocalStorageFromJWT(tokens);
          window.history.replaceState(null, "", window.location.pathname);
          window.location.href = "/main";
        } catch (err) {
          console.error("Google auth error:", err);
        }
      })();
    }
  }, []);

  // 👇 Перенаправление на Google OAuth
  const authenticate = () => {
    setLoading(true);
    const clientId =
      "1082367956142-ntu3usf4p07jpd1enjn7gj308a95qn4v.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/"; // не .href
    const scope = [
      "https://www.googleapis.com/auth/calendar",
      "openid",
      "email",
    ];
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
  };

  return { token, loading, authenticate };
};

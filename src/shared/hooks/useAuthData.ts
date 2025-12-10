import { useState, useEffect } from "react";
import { AUTH_DATA } from "shared/const/localstorage";

interface AuthData {
  access: string;
  id: number;
  avatar: string;
  email: string;
  first_name: string;
  last_name:string;
  position:string;
  isStudent:boolean;
  refresh: string;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthData>(() => {
    if (typeof window === "undefined") return null;
    const data = JSON.parse(localStorage.getItem(AUTH_DATA) || "{}");
    return data.access && data.id ? data : null;
  });

  useEffect(() => {
    const updateAuth = () => {
      const data = JSON.parse(localStorage.getItem(AUTH_DATA) || "{}");
      setAuth(data.access && data.id ? data : null);
    };

    window.addEventListener("storage", updateAuth);
    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  return auth;
};

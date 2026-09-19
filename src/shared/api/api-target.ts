export type ApiTarget = "local" | "prod";

export const LOCAL_DJANGO_ORIGIN = "http://localhost:8005";

/**
 * 👇 ЕДИНСТВЕННОЕ МЕСТО ДЛЯ ПЕРЕКЛЮЧЕНИЯ API
 *
 * "local" — Django на http://localhost:8005 (через Vite proxy, без CORS)
 * "prod"  — https://uadmin.kstu.kg
 *
 * После смены перезапустите `npm run dev`.
 */
export const API_TARGET: ApiTarget = "prod";

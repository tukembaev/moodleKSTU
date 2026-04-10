// Service Worker для Moodle KSTU PWA
// Версия кэша - изменяйте при каждом обновлении приложения
const CACHE_VERSION = "v1.0.0";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Ресурсы для предварительного кэширования
const PRECACHE_URLS = ["/", "/index.html", "/offline.html", "/manifest.json"];

// Паттерны для определения типа запроса
const API_URL_PATTERN = /\/api\//;
const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/;

// ============================================
// УСТАНОВКА (Install)
// ============================================
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Pre-caching essential resources");
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Skip Waiting: немедленная активация нового воркера
        console.log("[SW] Skip waiting - activating immediately");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Pre-cache failed:", error);
      })
  );
});

// ============================================
// АКТИВАЦИЯ (Activate)
// ============================================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Удаляем старые версии кэшей
              return (
                cacheName.startsWith("static-") ||
                cacheName.startsWith("dynamic-") ||
                cacheName.startsWith("api-")
              );
            })
            .filter((cacheName) => {
              return (
                cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== API_CACHE
              );
            })
            .map((cacheName) => {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Взять контроль над всеми страницами
        console.log("[SW] Claiming clients");
        return self.clients.claim();
      })
  );
});

// ============================================
// ПЕРЕХВАТ ЗАПРОСОВ (Fetch)
// ============================================
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем запросы не через HTTP/HTTPS
  if (!request.url.startsWith("http")) {
    return;
  }

  // Пропускаем запросы к Chrome extensions и другим внешним ресурсам
  if (url.origin !== location.origin) {
    return;
  }

  // API запросы: Network First
  if (API_URL_PATTERN.test(url.pathname)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Статические ассеты: Stale-While-Revalidate
  if (STATIC_EXTENSIONS.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Навигационные запросы (HTML): Network First с offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Остальные запросы: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ============================================
// СТРАТЕГИИ КЭШИРОВАНИЯ
// ============================================

/**
 * Network First: сначала сеть, потом кэш
 * Используется для API запросов
 */
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Возвращаем JSON ошибку для API
    return new Response(
      JSON.stringify({ error: "Нет подключения к сети", offline: true }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Stale-While-Revalidate: возвращает кэш и обновляет его в фоне
 * Используется для статических ассетов
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Обновляем кэш в фоне
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log("[SW] Background fetch failed:", request.url);
      return null;
    });

  // Возвращаем кэшированный ответ сразу, или ждём сеть
  return cachedResponse || fetchPromise;
}

/**
 * Network First с Offline Fallback
 * Используется для навигационных запросов
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Navigation failed, trying cache:", request.url);

    // Пробуем кэш
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Возвращаем offline страницу
    console.log("[SW] Serving offline fallback");
    return caches.match("/offline.html");
  }
}

// ============================================
// ОБРАБОТКА СООБЩЕНИЙ
// ============================================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[SW] Received SKIP_WAITING message");
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

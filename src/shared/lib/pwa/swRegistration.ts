/**
 * Service Worker Registration Module
 * Регистрация и управление Service Worker для PWA
 */

type UpdateCallback = (registration: ServiceWorkerRegistration) => void;

interface SWConfig {
  onUpdate?: UpdateCallback;
  onSuccess?: UpdateCallback;
}

/**
 * Проверяет поддержку Service Worker в браузере
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Регистрирует Service Worker с обработкой обновлений
 */
export async function registerSW(config?: SWConfig): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    console.log('[PWA] Service Worker не поддерживается в этом браузере');
    return null;
  }

  // ВАЖНО: Service Worker работает и в режиме разработки для тестирования PWA
  // Если нужно отключить, раскомментируйте:
  // if (import.meta.env.DEV) {
  //   console.log('[PWA] Service Worker отключён в режиме разработки');
  //   return null;
  // }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[PWA] Service Worker зарегистрирован:', registration.scope);

    // Проверяем наличие обновлений
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Новый контент доступен, нужно обновление
            console.log('[PWA] Доступно обновление приложения');
            config?.onUpdate?.(registration);
          } else {
            // Контент закэширован для офлайн использования
            console.log('[PWA] Контент закэширован для офлайн режима');
            config?.onSuccess?.(registration);
          }
        }
      });
    });

    // Периодическая проверка обновлений (каждый час)
    setInterval(() => {
      registration.update();
      console.log('[PWA] Проверка обновлений...');
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('[PWA] Ошибка регистрации Service Worker:', error);
    return null;
  }
}

/**
 * Отменяет регистрацию Service Worker
 */
export async function unregisterSW(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    
    if (success) {
      console.log('[PWA] Service Worker успешно удалён');
    }
    
    return success;
  } catch (error) {
    console.error('[PWA] Ошибка при удалении Service Worker:', error);
    return false;
  }
}

/**
 * Отправляет сообщение Service Worker для немедленной активации
 */
export function skipWaiting(registration: ServiceWorkerRegistration): void {
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Получает версию текущего Service Worker
 */
export async function getSWVersion(): Promise<string | null> {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  const controller = navigator.serviceWorker.controller;
  if (!controller) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data?.version || null);
    };

    controller.postMessage(
      { type: 'GET_VERSION' },
      [messageChannel.port2]
    );

    // Таймаут на случай отсутствия ответа
    setTimeout(() => resolve(null), 1000);
  });
}

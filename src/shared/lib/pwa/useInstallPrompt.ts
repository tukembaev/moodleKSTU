/**
 * useInstallPrompt Hook
 * Перехват события beforeinstallprompt для кастомной установки PWA
 */

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface UseInstallPromptReturn {
  /** Можно ли показать промпт установки */
  canInstall: boolean;
  /** Установлено ли приложение */
  isInstalled: boolean;
  /** Функция для показа промпта установки */
  promptInstall: () => Promise<boolean>;
  /** Платформы, доступные для установки */
  platforms: string[];
}

/**
 * Hook для управления установкой PWA
 * 
 * @example
 * ```tsx
 * function InstallButton() {
 *   const { canInstall, promptInstall, isInstalled } = useInstallPrompt();
 * 
 *   if (isInstalled) return <span>Приложение установлено!</span>;
 *   if (!canInstall) return null;
 * 
 *   return (
 *     <button onClick={promptInstall}>
 *       Установить приложение
 *     </button>
 *   );
 * }
 * ```
 */
export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    // Проверяем, установлено ли приложение
    const checkInstalled = () => {
      // Проверка через display-mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Проверка для iOS Safari
      const isIOSInstalled = (navigator as Navigator & { standalone?: boolean }).standalone === true;
      
      setIsInstalled(isStandalone || isIOSInstalled);
    };

    checkInstalled();

    // Слушаем изменения display-mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Перехватываем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Предотвращаем показ стандартного промпта браузера
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setPlatforms(promptEvent.platforms || []);
      
      console.log('[PWA] Событие beforeinstallprompt перехвачено');
      console.log('[PWA] Доступные платформы:', promptEvent.platforms);
    };

    // Слушаем успешную установку
    const handleAppInstalled = () => {
      console.log('[PWA] Приложение успешно установлено');
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Показывает промпт установки и возвращает результат
   * @returns true если пользователь установил приложение, false если отклонил
   */
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('[PWA] Промпт установки недоступен');
      return false;
    }

    try {
      // Показываем промпт
      await deferredPrompt.prompt();
      
      // Ждём выбора пользователя
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[PWA] Результат установки:', outcome);
      
      // Очищаем сохранённый промпт
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Ошибка при показе промпта установки:', error);
      return false;
    }
  }, [deferredPrompt]);

  return {
    canInstall: !!deferredPrompt && !isInstalled,
    isInstalled,
    promptInstall,
    platforms,
  };
}

export default useInstallPrompt;

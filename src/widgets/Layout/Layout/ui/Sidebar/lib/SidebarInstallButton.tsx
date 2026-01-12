import { useState, useEffect } from 'react';
import { Download, Smartphone, Apple, Share } from 'lucide-react';
import { useInstallPrompt } from 'shared/lib/pwa/useInstallPrompt';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from 'shared/shadcn/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";

export const SidebarInstallButton = () => {
  const { promptInstall, isInstalled } = useInstallPrompt();
  const [isMobile, setIsMobile] = useState(false)
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Проверка на iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  useEffect(() => {
    const ua = navigator.userAgent;

    // Проверка на iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Проверка на мобильное устройство (общая)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      window.innerWidth <= 768; // Дополнительно проверяем ширину экрана

    setIsMobile(isMobileDevice);
  }, []);

  // Если уже установлено, ничего не показываем
  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      const result = await promptInstall();
      console.log('Install result:', result);
    }
  };

  // Показываем кнопку если:
  // 1. Это Android и браузер разрешил установку (canInstall)
  // 2. Это iOS (всегда показываем, так как canInstall там всегда false)
  //   if (!canInstall && !isIOS) return null;

  return (
    <>
      <SidebarMenu>
        {isMobile && (
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleInstallClick}
              tooltip="Установить приложение"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium"
            >
              {isIOS ? <Apple className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span>Установить PWA</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>

      {/* Инструкция для iOS */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5" /> Установка на iPhone/iPad
            </DialogTitle>
            <DialogDescription>
              Чтобы установить приложение на ваш iPhone или iPad, выполните следующие действия:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-400">
                <Share className="w-5 h-5" />
              </div>
              <p className="text-sm">
                1. Нажмите кнопку <strong>"Поделиться"</strong> в нижней панели браузера Safari.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-400">
                <Download className="w-5 h-5" />
              </div>
              <p className="text-sm">
                2. Прокрутите меню вниз и выберите пункт <strong>"На экран «Домой»"</strong>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 p-2 rounded-full text-white font-bold text-xs w-9 h-9 flex items-center justify-center">
                +
              </div>
              <p className="text-sm">
                3. Нажмите <strong>"Добавить"</strong> в верхнем правом углу.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
          >
            Понятно
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

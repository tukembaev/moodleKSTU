import React from 'react';
import { useInstallPrompt } from 'shared/lib/pwa/useInstallPrompt';
import { Download, X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { canInstall, promptInstall, isInstalled } = useInstallPrompt();
  const [isVisible, setIsVisible] = React.useState(true);

  // Если уже установлено, или нельзя установить, или пользователь закрыл баннер
  if (isInstalled || !canInstall || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-800 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <Download size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Установить Moodle KSTU</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Быстрый доступ и работа офлайн</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={promptInstall}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md active:scale-95"
          >
            Установить
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

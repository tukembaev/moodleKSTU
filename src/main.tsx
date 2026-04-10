import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";

import { BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "app/providers/ErrorBoundary/ErrorBoundary/index.ts";
import "app/styles/global.css";
import { queryClient } from "shared/api/queryClient.ts";

// PWA Registration
import { registerSW } from "shared/lib/pwa";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

// Register Service Worker for PWA
registerSW({
  onUpdate: (registration) => {
    // Показываем уведомление о доступном обновлении
    console.log('[APP] Доступно обновление приложения');
    
    // Опционально: можно показать toast/snackbar для пользователя
    // и предложить обновить страницу
    if (confirm('Доступна новая версия приложения. Обновить?')) {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  },
  onSuccess: () => {
    console.log('[APP] Приложение готово к работе в офлайн режиме');
  },
});

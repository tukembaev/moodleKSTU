import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
// import basicSsl from "@vitejs/plugin-basic-ssl"
// import { analyzer } from 'vite-bundle-analyzer'
export default defineConfig({
  plugins: [
    react(), // Fast Refresh включен по умолчанию для лучшего HMR
    tailwindcss(),

    // basicSsl() // Отключено - используем ngrok для HTTPS
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true, // Разрешаем ngrok и другие хосты
    // Оптимизация HMR
    hmr: {
      overlay: true, // Показывать ошибки как оверлей
    },
    // Улучшенное кэширование
    fs: {
      strict: false
    }
  },
  resolve: {
    alias: {
      'app': path.resolve("./src/app/"),
      'entities': path.resolve("./src/entities/"),
      'features': path.resolve("./src/features/"),
      'pages': path.resolve("./src/pages/"),
      'shared': path.resolve("./src/shared/"),
      'widgets': path.resolve("./src/widgets/"),
      '@': path.resolve("./src/@/"),
      'lib': path.resolve("./src/lib"),
    }
  },
  // Оптимизация зависимостей для dev режима
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react'
    ],
    // Принудительная предварительная сборка для стабильности HMR
    force: false
  },
  build: {
    chunkSizeWarningLimit: 500,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'react-query': ['@tanstack/react-query'],
          charts: ['recharts'],
          icons: ['lucide-react', 'react-icons'],
        },
      },
    },
  },
  // Кэширование для ускорения пересборки
  cacheDir: 'node_modules/.vite'
})

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { analyzer } from 'vite-bundle-analyzer'
export default defineConfig({
  plugins: [react(),tailwindcss(),analyzer()],

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
  build: {
    chunkSizeWarningLimit: 500,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react', 'react-icons'],
        },
      },
    },
  },

})

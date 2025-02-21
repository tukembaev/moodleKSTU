import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: '/login',
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
})

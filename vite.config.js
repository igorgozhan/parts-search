import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// /api/hsprice/ -> http://api.favorit-parts.ru/hs/hsprice/
const proxy = {
  '/api': {
    target: 'http://api.favorit-parts.ru',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/hs'),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})

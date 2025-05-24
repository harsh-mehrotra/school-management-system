import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'https://schoolapi.bluesales.ai', // Backend API URL
        changeOrigin: true,
        secure: true,
      },
    },
  },
})


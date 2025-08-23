import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://framework-production-92f5.up.railway.app')
  },
  server: {
    port: 5173,
    host: true
  }
})

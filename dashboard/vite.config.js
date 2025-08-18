import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://backend-production-3545.up.railway.app')
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Force new hash by adding timestamp
        entryFileNames: 'assets/[name]-[hash]-' + Date.now() + '.js',
        chunkFileNames: 'assets/[name]-[hash]-' + Date.now() + '.js',
        assetFileNames: 'assets/[name]-[hash]-' + Date.now() + '.[ext]'
      }
    }
  }
});

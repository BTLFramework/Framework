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
  }
});

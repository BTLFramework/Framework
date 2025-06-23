import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync("../back-to-life-f-server/config/ssl/key.pem"),
      cert: fs.readFileSync("../back-to-life-f-server/config/ssl/cert.pem"),
    },
    port: 5175,
  },
});

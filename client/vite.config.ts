import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "journyjunkies.ddns.net",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://journyjunkies.ddns.net:8081",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

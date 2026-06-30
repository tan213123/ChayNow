import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const apiProxyTarget = "http://localhost:8081";

// Proxy để call API Backend
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    open: "/",

    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,

        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});

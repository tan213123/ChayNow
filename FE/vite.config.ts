import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const apiProxyTarget =
  "https://dbdd-2001-ee0-4f0d-98b0-d1-682a-c996-692e.ngrok-free.app";

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
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false,

        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});

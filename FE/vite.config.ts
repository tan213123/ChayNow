import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
        target: "https://43a7-14-187-89-101.ngrok-free.app",

        changeOrigin: true,
        secure: false,

        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});

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
        target:
          "https://af0e-2001-ee0-4f0d-98b0-c017-aed3-c3f2-eb95.ngrok-free.app",

        changeOrigin: true,
        secure: false,

        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
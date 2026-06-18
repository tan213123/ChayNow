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
          "https://dceb-2001-ee0-4f0d-98b0-70f7-c61a-65f8-9e0e.ngrok-free.app",

        changeOrigin: true,
        secure: false,
      },
    },
  },
});

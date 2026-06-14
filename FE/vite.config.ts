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
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// proxy để call API
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // mọi request bắt đầu với /api sẽ được chuyển tiếp
        target:
          "https://6c6e-2405-4803-ccdd-f6f0-c0b5-aaf6-31a0-74a4.ngrok-free.app", // thay port theo backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

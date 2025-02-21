import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    include: ["quill", "quill-emoji"],
  },
  server: {
    proxy: { "/api": { target: "http://localhost:3000", secure: false } },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("quill")) return "quill";
            if (id.includes("firebase")) return "firebase";
            return "vendor"; // General vendor chunk
          }
        },
      },
    },
  },
  plugins: [react()],
});

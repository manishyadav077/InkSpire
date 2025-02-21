import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: { "/api": { target: "http://localhost:3000", secure: false } },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        globals: {
          react: "React",
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "firebase";
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [react()],
});

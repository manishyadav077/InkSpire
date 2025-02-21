import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: { "/api": { target: "http://localhost:3000", secure: false } },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Ensure compatibility with Quill (ESM + CJS)
    },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      external: ["react"], // Prevent React from being bundled inside Quill
      output: {
        globals: {
          react: "React",
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "firebase"; // Keep Firebase separate
            return "vendor"; // General vendor chunk
          }
        },
      },
    },
  },
  plugins: [react()],
});

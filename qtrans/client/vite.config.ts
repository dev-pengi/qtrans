import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateIndexPlugin } from "vite-exporter";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateIndexPlugin({
      dirs: ["src/components", "src/hooks"],
    }),
  ],
  build: {
    outDir: "build",
  },
  server: { hmr: true },
  base: "./",
  resolve: {
    alias: {
      src: "/src",
    },
  },
});

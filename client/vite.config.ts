import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateIndexPlugin } from "vite-exporter";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateIndexPlugin({
      dirs: [
        "src/components",
        "src/contexts",
        "src/hooks",
        "src/types",
        "src/api",
      ],
      excludes: ["src/components/styles/*"],
    }),
  ],
  build: {
    outDir: "../dist/build",
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  base: "./",
  resolve: {
    alias: {
      src: "/src",
    },
  },
});

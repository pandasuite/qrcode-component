import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    target: ["chrome87", "firefox78", "safari14", "edge88"],
  },
});

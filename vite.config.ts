import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {},
  },
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        popup: "popup/index.html",
        content: "content/index.ts",
      },
      output: {
        entryFileNames: "[name]/[name].js",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});

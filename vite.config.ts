import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    AutoImport({
      imports: ["vue", "vue/macros"],
    }),
    vue(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "src/static/*",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        content: "src/content/index.ts",
        absorbColor: "src/content/absorbColor.ts",
        background: "src/background/service-worker.ts",
      },
      output: {
        entryFileNames(chunkInfo) {
          const dirName = chunkInfo.facadeModuleId?.split("\\").at(-2);
          if (chunkInfo.name === "popup") return "[name]/[name].js";
          else return `${dirName}/[name].js`;
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});

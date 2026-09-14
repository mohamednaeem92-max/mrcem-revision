import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

function inlineJsonPlugin(): Plugin {
  return {
    name: "inline-json",
    transform(code, id) {
      if (process.env.STANDALONE !== "1") return null;
      if (!id.includes("ocrDraftSections.ts")) return null;
      const jsonPath = path.resolve(import.meta.dirname, "client", "public", "ocr-questions.json");
      const data = fs.readFileSync(jsonPath, "utf-8");
      return {
        code: code.replace(
          /await fetch\("\/ocr-questions\.json"\)/g,
          `Promise.resolve({ json: () => Promise.resolve(${data}) })`
        ),
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineJsonPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "./",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
});

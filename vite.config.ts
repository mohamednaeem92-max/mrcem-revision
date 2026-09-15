import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const rootDir = import.meta.dirname;
const standalone = process.env.STANDALONE === "1";
const questionBankPath = path.resolve(rootDir, "client", "public", "ocr-questions.json");

function collectFiles(dir: string, base = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full, base));
      continue;
    }
    if (entry.name === "sw.js" || entry.name.endsWith(".xlsx") || entry.name === ".gitkeep") continue;
    files.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return files;
}

function questionBankPlugin(): Plugin {
  const virtualId = "virtual:question-bank";
  const resolvedId = "\0" + virtualId;
  return {
    name: "question-bank-virtual",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
      return null;
    },
    load(id) {
      if (id !== resolvedId) return null;
      if (!standalone) return "export const inlineQuestionBank = null;\n";
      const data = fs.readFileSync(questionBankPath, "utf-8");
      return `export const inlineQuestionBank = ${data};\n`;
    },
  };
}

function offlinePwaPlugin(): Plugin {
  return {
    name: "offline-pwa",
    closeBundle() {
      const dist = path.resolve(rootDir, "dist");
      if (!fs.existsSync(dist)) return;
      const assets = collectFiles(dist);
      const precache = Array.from(new Set(["./", "./index.html", ...assets.map((file) => "./" + file)]));
      const revision = createHash("sha1").update(precache.join("|")).digest("hex").slice(0, 10);
      const source = `const CACHE_NAME = "meridian-${revision}";
const PRECACHE = ${JSON.stringify(precache, null, 2)};
const LARGE = PRECACHE.filter((url) => url.endsWith(".json"));
const SMALL = PRECACHE.filter((url) => !LARGE.includes(url));

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SMALL);
    for (const url of LARGE) {
      try { await cache.add(url); } catch (error) { console.warn("Could not precache", url, error); }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.status === 200 && (response.type === "basic" || response.type === "cors")) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      if (event.request.mode === "navigate") {
        return (await caches.match("./index.html")) || (await caches.match("./")) || Response.error();
      }
      throw error;
    }
  })());
});
`;
      fs.writeFileSync(path.join(dist, "sw.js"), source);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), questionBankPlugin(), offlinePwaPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "client", "src"),
      "@shared": path.resolve(rootDir, "shared"),
    },
  },
  root: path.resolve(rootDir, "client"),
  base: "./",
  build: {
    outDir: path.resolve(rootDir, "dist"),
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

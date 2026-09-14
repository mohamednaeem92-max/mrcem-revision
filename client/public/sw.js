const CACHE_NAME = "meridian-v2";
const BASE = new URL("./", self.registration.scope).pathname;
const PRECACHE = [
  BASE,
  BASE + "index.html",
  BASE + "favicon.svg",
  BASE + "manifest.json",
  BASE + "icons/icon-192.svg",
  BASE + "icons/icon-512.svg",
];
const LARGE_FILES = [BASE + "ocr-questions.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => caches.open(CACHE_NAME)).then((cache) =>
      Promise.all(LARGE_FILES.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetched;
    })
  );
});

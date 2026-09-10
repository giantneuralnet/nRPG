const CACHE_NAME = "drop-rpg-offline-v3";

const OFFLINE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.webmanifest",
  "./app-icon.svg",
  "./apple-touch-icon.png",
  "./src/core.js",
  "./src/systems/audio.js",
  "./src/render/icons.js",
  "./src/state.js",
  "./src/effects.js",
  "./src/systems/spawning.js",
  "./src/systems/hero.js",
  "./src/systems/items.js",
  "./src/systems/combat.js",
  "./src/systems/update.js",
  "./src/render/ui.js",
  "./src/render/entities.js",
  "./src/render/effects.js",
  "./src/menu.js",
  "./src/render/draw.js",
  "./src/input.js",
  "./src/main.js",
  "./src/pwa.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});

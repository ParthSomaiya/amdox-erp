// public/sw.js
const CACHE_NAME = "amdox-erp-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/favicon.svg"
];

// install event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// fetch event with stale-while-revalidate strategy for offline support
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Revert to cached fallback if network fails
        });

      return cachedResponse || fetchPromise;
    })
  );
});
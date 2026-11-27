const BASE = '/pagina-catalogo-de-muebles/';
const CACHE_NAME = 'multiforme-v5';
const ICONS = [
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.allSettled([
      self.skipWaiting(),
      caches.open(CACHE_NAME).then(cache =>
        Promise.allSettled(ICONS.map(url => cache.add(url)))
      ),
    ])
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.allSettled([
      caches.keys().then(keys =>
        Promise.allSettled(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const pathname = requestUrl.pathname;

  if (
    request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    !pathname.startsWith(BASE) ||
    pathname.startsWith(BASE + 'assets/') ||
    pathname === BASE + 'manifest.json'
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          try {
            return (await caches.match(BASE + 'index.html')) || Response.error();
          } catch {
            return Response.error();
          }
        }
      })()
    );
    return;
  }

  if (ICONS.includes(pathname)) {
    event.respondWith(
      (async () => {
        try {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          const response = await fetch(request);
          if (response.ok) {
            try {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, response.clone());
            } catch {
              // Keep serving the network response if caching fails.
            }
          }
          return response;
        } catch {
          try {
            return (await caches.match(request)) || Response.error();
          } catch {
            return Response.error();
          }
        }
      })()
    );
  }
});

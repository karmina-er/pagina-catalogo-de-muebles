const BASE = '/pagina-catalogo-de-muebles/';
const CACHE_NAME = 'multiforme-v6';
const CORE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await Promise.allSettled(
          CORE_ASSETS.map(async url => {
            try {
              const res = await fetch(url, { cache: 'reload' });
              if (res.ok) await cache.put(url, res);
            } catch {
              // Ignora si algún recurso puntual falla al instalar
            }
          })
        );
      } finally {
        await self.skipWaiting();
      }
    })()
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.allSettled(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        );
      } finally {
        await self.clients.claim();
      }
    })()
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const pathname = requestUrl.pathname;

  if (
    request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    !pathname.startsWith(BASE)
  ) {
    return;
  }

  // Navegación (HTML): intenta red y si está offline cae en index.html cacheado
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            try {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(BASE + 'index.html', networkResponse.clone());
            } catch {
              // Ignora fallo al escribir caché
            }
          }
          return networkResponse;
        } catch {
          const cachedIndex =
            (await caches.match(BASE + 'index.html')) ||
            (await caches.match(BASE));
          return cachedIndex || Response.error();
        }
      })()
    );
    return;
  }

  // Resto de archivos del sitio (assets JS/CSS, imágenes, manifest, íconos):
  // Cache first con respaldo a red y guardado automático
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          } catch {
            // Mantiene la respuesta de red aunque falle cache.put
          }
        }
        return networkResponse;
      } catch {
        return (await caches.match(pathname)) || Response.error();
      }
    })()
  );
});
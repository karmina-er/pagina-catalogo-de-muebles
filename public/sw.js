const BASE = '/pagina-catalogo-de-muebles/';
const CACHE_NAME = 'multiforme-v4';
const PRECACHE_URLS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.allSettled([
      self.skipWaiting(),
      caches.open(CACHE_NAME).then(cache =>
        Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url)))
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

  if (
    request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    !requestUrl.pathname.startsWith(BASE)
  ) {
    return;
  }

  const handleRequest = async () => {
    try {
      if (request.mode === 'navigate') {
        try {
          const response = await fetch(request);
          if (response.ok) return response;
        } catch {
          // Use the cached app shell when the network is unavailable.
        }

        return (await caches.match(BASE + 'index.html')) || new Response(
          'Service Unavailable',
          { status: 503, statusText: 'Service Unavailable' }
        );
      }

      if (requestUrl.pathname.startsWith(BASE + 'assets/')) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            try {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, response.clone());
            } catch {
              // Return the network response even if it cannot be cached.
            }
            return response;
          }
        } catch {
          // Try the previously cached version of this hashed asset.
        }

        return (await caches.match(request)) || new Response(
          'Service Unavailable',
          { status: 503, statusText: 'Service Unavailable' }
        );
      }

      let cachedResponse;
      try {
        cachedResponse = await caches.match(request);
      } catch {
        // Fall back to the network if the cache cannot be read.
      }
      if (cachedResponse) return cachedResponse;

      const response = await fetch(request);
      if (response.ok) {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        } catch {
          // Return the network response even if it cannot be cached.
        }
      }
      return response;
    } catch {
      return new Response('Service Unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
      });
    }
  };

  event.respondWith(handleRequest());
});

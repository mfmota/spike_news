const CACHE_NAME = 'spike-news-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/icon-maskable.svg',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore SSE match stream, API mutating requests, or non-GET
  if (
    request.method !== 'GET' ||
    url.pathname.includes('/api/matches/stream') ||
    url.pathname.startsWith('/api/admin')
  ) {
    return;
  }

  // Network First with Cache Fallback for dynamic/pages
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Cache static assets and catalog GETs
            if (
              url.pathname.startsWith('/icons/') ||
              url.pathname.endsWith('.svg') ||
              url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.js')
            ) {
              cache.put(request, responseToCache);
            }
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If navigating to a page offline, fallback to root cache
        if (request.mode === 'navigate') {
          const fallback = await caches.match('/');
          if (fallback) return fallback;
        }
        return new Response('Offline - Spike News', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' }),
        });
      })
  );
});

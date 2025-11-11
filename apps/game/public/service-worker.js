// Service Worker for Joscola PWA
// Version 1.1.4 - fix: train counting exercises

const CACHE_NAME = 'joscola-v1.1.4';
const RUNTIME_CACHE = 'joscola-runtime-v1.1.4';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  // We'll add more URLs dynamically based on build output
];

// Install event - pre-cache essential resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('joscola-') && cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle API calls differently (network-first)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // For app resources, use cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Determine which cache to use
        let cacheName = RUNTIME_CACHE;

        // Cache static assets in the main cache
        if (url.pathname.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico)$/)) {
          cacheName = CACHE_NAME;
        }

        // Add to cache
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch((error) => {
        console.error('[Service Worker] Fetch failed:', error);

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/');
        }

        throw error;
      });
    })
  );
});

// Message event - handle cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skip waiting on message');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.payload;
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urls).then(() => {
        console.log('[Service Worker] Additional URLs cached');
      });
    });
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-exercises') {
    console.log('[Service Worker] Syncing exercise data...');
    event.waitUntil(
      // Sync exercise progress when coming back online
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            message: 'Exercise data synced'
          });
        });
      })
    );
  }
});
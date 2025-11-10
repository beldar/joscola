// Service Worker Registration Script

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available, prompting for update...');

            // Notify the app about the update
            if (window.onServiceWorkerUpdate) {
              window.onServiceWorkerUpdate();
            }
          }
        });
      });

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 1000 * 60 * 60); // Check every hour

      // Cache additional resources after page load
      if (registration.active) {
        // Get all Next.js build assets
        const buildManifest = document.querySelector('script[id="__BUILD_MANIFEST"]');
        const appBuildManifest = document.querySelector('script[id="__APP_BUILD_MANIFEST"]');

        const urlsToCache = [];

        // Cache all script and style tags
        document.querySelectorAll('script[src], link[rel="stylesheet"]').forEach((element) => {
          const url = element.src || element.href;
          if (url && !url.includes('_next/static/development')) {
            urlsToCache.push(url);
          }
        });

        // Cache fonts
        document.querySelectorAll('link[rel="preload"][as="font"]').forEach((element) => {
          if (element.href) {
            urlsToCache.push(element.href);
          }
        });

        // Send URLs to service worker for caching
        if (urlsToCache.length > 0 && registration.active) {
          registration.active.postMessage({
            type: 'CACHE_URLS',
            payload: urlsToCache
          });
        }
      }

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });

  // Handle controller change
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker controller changed, reloading...');
    window.location.reload();
  });

  // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_COMPLETE') {
      console.log('Data sync complete:', event.data.message);
    }
  });
}
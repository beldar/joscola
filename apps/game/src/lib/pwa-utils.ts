/**
 * PWA Utility Functions
 */

export interface UpdateInfo {
  available: boolean;
  message: string;
}

/**
 * Register service worker and handle updates
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('Service Worker registered:', registration);

    // Check for updates every hour
    setInterval(() => {
      registration.update();
    }, 1000 * 60 * 60);

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Check if app is running as installed PWA
 */
export function isInstalledPWA(): boolean {
  // Check display mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // iOS specific check
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  // Check if launched from home screen (for some browsers)
  if (document.referrer.includes('android-app://')) {
    return true;
  }

  return false;
}

/**
 * Get device type and capabilities
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent;

  return {
    isIOS: /iPad|iPhone|iPod/.test(ua),
    isAndroid: /Android/.test(ua),
    isTablet: /iPad|Android(?!.*Mobile)/.test(ua),
    isMobile: /Mobile|Android|iPhone/.test(ua),
    isPWA: isInstalledPWA(),
    hasTouch: 'ontouchstart' in window,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    orientation: window.screen.orientation?.type || 'unknown',
  };
}

/**
 * Request persistent storage for better offline support
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persistent storage ${isPersisted ? 'granted' : 'denied'}`);
    return isPersisted;
  }
  return false;
}

/**
 * Estimate available storage
 */
export async function getStorageEstimate() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      usageInMB: ((estimate.usage || 0) / (1024 * 1024)).toFixed(2),
      quotaInMB: ((estimate.quota || 0) / (1024 * 1024)).toFixed(2),
      percentUsed: estimate.quota ? ((estimate.usage || 0) / estimate.quota * 100).toFixed(2) : '0'
    };
  }
  return null;
}

/**
 * Check network connectivity
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Monitor network status changes
 */
export function onNetworkChange(callback: (online: boolean) => void) {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));

  // Return cleanup function
  return () => {
    window.removeEventListener('online', () => callback(true));
    window.removeEventListener('offline', () => callback(false));
  };
}

/**
 * Prefetch critical resources
 */
export async function prefetchResources(urls: string[]): Promise<void> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return;
  }

  // Send message to service worker to cache these URLs
  navigator.serviceWorker.controller.postMessage({
    type: 'CACHE_URLS',
    payload: urls
  });
}

/**
 * Clear app caches (useful for updates or debugging)
 */
export async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  }
}

/**
 * Handle app updates
 */
export function onAppUpdateAvailable(callback: () => void): () => void {
  if (!('serviceWorker' in navigator)) {
    return () => {};
  }

  const handleControllerChange = () => {
    callback();
  };

  navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

  // Return cleanup function
  return () => {
    navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
  };
}
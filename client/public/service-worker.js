const CACHE_NAME = 'my-pwa-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching resources...');
        return cache.addAll(['/', '/index.html']);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('Found in cache:', event.request.url);
        return response;
      }
      console.log('Fetching from network:', event.request.url);
      return fetch(event.request).catch((error) => {
        console.error('Failed to fetch:', event.request.url, error);
        throw error;
      });
    })
  );
});

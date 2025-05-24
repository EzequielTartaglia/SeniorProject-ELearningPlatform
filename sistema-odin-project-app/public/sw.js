self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
      caches.open('static-cache').then(cache => {
        return cache.addAll([
          '/',
          '/favicon.ico',
          '/icon-192x192.png',
          '/icon-512x512.png',
          '/manifest.json',
        ]);
      })
    );
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  

const CACHE_NAME = 'sport-tracker-simple-v1';

self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated!');
  event.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

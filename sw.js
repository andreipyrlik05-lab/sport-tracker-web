const CACHE_NAME = 'sport-tracker-v3';
const urlsToCache = [
  '/',
  '/index.html', 
  '/manifest.json',
  'https://cdn.jsdelivr.net/gh/andreipyrlik05-lab/sport-tracker-web/icon-192.png',
  'https://cdn.jsdelivr.net/gh/andreipyrlik05-lab/sport-tracker-web/icon-512.png'
];

// Установка - только один обработчик!
self.addEventListener('install', function(event) {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Активируем сразу
  );
});

// Активация - очистка старых кешей
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Берем контроль над всеми вкладками
  );
});

// Перехват запросов
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Возвращаем кеш или делаем запрос
        return response || fetch(event.request);
      })
  );
});

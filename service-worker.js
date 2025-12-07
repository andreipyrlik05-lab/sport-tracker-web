// service-worker.js - УПРОЩЕННАЯ СТАБИЛЬНАЯ ВЕРСИЯ
const CACHE_NAME = 'sport-tracker-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-144.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/styles.css',
  '/app.js'
];

// Установка - кэшируем основные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация - очищаем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Обработка запросов - ПРОСТАЯ И БЕЗОПАСНАЯ ВЕРСИЯ
self.addEventListener('fetch', event => {
  // Обрабатываем только GET запросы и не трогаем chrome-extension
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Если есть в кэше - возвращаем
        if (cachedResponse) {
          return cachedResponse;
        }

        // Иначе грузим из сети
        return fetch(event.request)
          .then(networkResponse => {
            // Кэшируем только успешные ответы на GET запросы
            if (networkResponse.ok && event.request.method === 'GET') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page instead.', error);
            // Можно вернуть кастомную оффлайн-страницу или пустой ответ
            return new Response('Нет интернета', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});
EOF

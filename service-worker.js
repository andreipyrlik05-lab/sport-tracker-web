// service-worker.js
const CACHE_NAME = 'sport-tracker-v1';
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

// Установка Service Worker и кэширование файлов
self.addEventListener('install', event => {
  console.log('🛠️ Устанавливаю Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэширую файлы для оффлайн-работы');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Активируем сразу
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  console.log('🚀 Активирую Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Удаляю старый кэш:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Берём управление всеми клиентами
});

// Перехват сетевых запросов
self.addEventListener('fetch', event => {
  // Пропускаем не-GET запросы и chrome-extension
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если файл есть в кэше — отдаём из кэша
        if (response) {
          console.log('🎯 Из кэша:', event.request.url);
          return response;
        }

        // Иначе загружаем из сети
        console.log('🌐 Из сети:', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            // Не кэшируем ошибки и неподходящие ответы
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Клонируем для кэширования
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('💾 Закэшировано:', event.request.url);
              });

            return networkResponse;
          })
          .catch(error => {
            console.log('❌ Ошибка загрузки:', error);
            // Можно вернуть кастомную оффлайн-страницу
            // return caches.match('/offline.html');
          });
      })
  );
});

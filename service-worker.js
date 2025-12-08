// service-worker.js - ПОЛНАЯ ВЕРСИЯ ДЛЯ PWA BUILDER
const CACHE_NAME = 'sport-tracker-v3';
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
  '/app.js',
  '/screenshots/screenshot1.png',
  '/screenshots/screenshot2.png'
];

// 1. INSTALL - с прогрессом
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Установка начата');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Кэширую основные файлы');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Установка завершена');
        return self.skipWaiting();
      })
  );
});

// 2. ACTIVATE - с очисткой
self.addEventListener('activate', event => {
  console.log('🔧 Service Worker: Активация');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Удаляю старый кэш', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Активация завершена');
      return self.clients.claim();
    })
  );
});

// 3. FETCH - стратегия "Network First, Cache Fallback"
self.addEventListener('fetch', event => {
  // Для API запросов - всегда сеть
  if (event.request.url.includes('/api/')) {
    return fetch(event.request);
  }
  
  // Для статики - сначала кэш, потом сеть
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Если в кэше и это не HTML - отдаём из кэша
        if (cachedResponse && !event.request.url.endsWith('.html')) {
          return cachedResponse;
        }
        
        // Иначе пробуем сеть
        return fetch(event.request)
          .then(networkResponse => {
            // Клонируем для кэширования
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // Если сети нет и нет в кэше - показываем оффлайн страницу
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Оффлайн', {
              status: 503,
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
          });
      })
  );
});

// 4. BACKGROUND SYNC (для PWA Builder)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('🔄 Service Worker: Background Sync запущен');
    event.waitUntil(syncData());
  }
});

// 5. PUSH NOTIFICATIONS (заглушка для проверки)
self.addEventListener('push', event => {
  console.log('📢 Service Worker: Push уведомление получено');
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('Sport Tracker', options)
  );
});

// 6. NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
  console.log('👆 Service Worker: Уведомление нажато');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Вспомогательная функция
async function syncData() {
  console.log('🔄 Service Worker: Синхронизация данных...');
  // Здесь может быть синхронизация с сервером
  return Promise.resolve();
}

console.log('✅ Service Worker загружен и готов к работе');
EOF


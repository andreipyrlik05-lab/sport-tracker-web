if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Сначала проверяем нет ли уже зарегистрированного Service Worker
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        console.log('✅ Service Worker уже зарегистрирован');
        return;
      }
      
      // Если нет - регистрируем новый
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('✅ Service Worker зарегистрирован:', registration.scope);
          
          // Проверяем статус
          if (registration.installing) {
            console.log('📥 Service Worker устанавливается');
          } else if (registration.waiting) {
            console.log('⏳ Service Worker ожидает активации');
          } else if (registration.active) {
            console.log('🎉 Service Worker активен!');
          }
        })
        .catch(function(error) {
          console.log('❌ Ошибка регистрации Service Worker:', error);
        });
    });
  });
}

const CACHE_NAME = 'rutina-app-v1.0.0';
const urlsToCache = [
  '/RutinaAppNew/',
  '/RutinaAppNew/index.html',
  '/RutinaAppNew/styles.css',
  '/RutinaAppNew/script.js',
  '/RutinaAppNew/manifest.json',
  '/RutinaAppNew/firebase-config.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip caching for data requests and API calls
  if (event.request.url.includes('api/') || 
      event.request.url.includes('data/') ||
      event.request.url.includes('storage')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Get offline data from IndexedDB
    const offlineData = await getOfflineData();
    
    if (offlineData && offlineData.length > 0) {
      // Sync with server when online
      await syncOfflineData(offlineData);
      console.log('Background sync completed');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get offline data from IndexedDB
async function getOfflineData() {
  // This would access IndexedDB to get offline changes
  // For now, return empty array
  return [];
}

// Sync offline data with server
async function syncOfflineData(data) {
  // This would send offline changes to server
  // For now, just log the data
  console.log('Syncing offline data:', data);
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/icon.png',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/icon.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('RutinaApp', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
           // Open the app
       event.waitUntil(
         clients.openWindow('/RutinaAppNew/')
       );
  }
});

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

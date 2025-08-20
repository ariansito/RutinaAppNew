const CACHE_NAME = 'rutina-app-dev-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './firebase-config.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker (DEV) installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache (DEV)');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip caching for data requests and API calls
  if (event.request.url.includes('api/') || 
      event.request.url.includes('data/') ||
      event.request.url.includes('storage') ||
      event.request.url.includes('chrome-extension') ||
      event.request.url.includes('moz-extension') ||
      event.request.url.includes('ms-browser-extension')) {
    return;
  }

  // Always fetch from network first for development
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response for offline use
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker (DEV) activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache (DEV):', cacheName);
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
    console.log('Background sync triggered (DEV)');
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
      console.log('Background sync completed (DEV)');
    }
  } catch (error) {
    console.error('Background sync failed (DEV):', error);
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
  console.log('Syncing offline data (DEV):', data);
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received (DEV):', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: './icon.png',
    badge: './badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: './icon.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: './icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('RutinaApp (DEV)', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked (DEV):', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('./')
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

  // Handle data updates from the app
  if (event.data && event.data.type === 'DATA_UPDATED') {
    console.log('Data updated in Service Worker (DEV):', event.data);
    // Store data in IndexedDB for offline access
    storeDataOffline(event.data);
  }
});

// Store data offline in IndexedDB
async function storeDataOffline(data) {
  try {
    // For development, just log the data
    console.log('Storing data offline (DEV):', data);
    
    // You could implement IndexedDB storage here if needed
    // For now, we'll just use localStorage as backup
    if (data.tasks) {
      localStorage.setItem('rutinaApp_tasks_backup', JSON.stringify(data.tasks));
    }
    if (data.events) {
      localStorage.setItem('rutinaApp_events_backup', JSON.stringify(data.events));
    }
  } catch (error) {
    console.error('Error storing data offline (DEV):', error);
  }
}

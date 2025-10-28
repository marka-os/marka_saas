const CACHE_NAME = "marka-v1";
const urlsToCache = [
  "/",
  "/static/css/main.css",
  "/static/js/main.js",
  "/manifest.json",
  // Add other static assets
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache).catch((error) => {
        console.log("Cache addAll error:", error);
        // Continue even if some resources fail to cache
      });
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("/api/")) return;

  const url = new URL(event.request.url);

  // Skip extension and devtools requests
  if (
    url.protocol === "chrome-extension:" ||
    url.protocol === "moz-extension:" ||
    url.protocol === "chrome:" ||
    url.protocol === "file:"
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Only cache HTTP/HTTPS requests
        if (url.protocol.startsWith("http")) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch((error) => {
              console.log("Cache put error:", error);
            });
          });
        }

        return response;
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Background sync triggered");
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  // This could include syncing data, sending queued requests, etc.
  console.log("Performing background sync...");
}

// Push notifications (if needed in the future)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification from Marka",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Details",
        icon: "/icon-192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Marka Notification", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    // Open the app or navigate to relevant page
    event.waitUntil(clients.openWindow("/"));
  }
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

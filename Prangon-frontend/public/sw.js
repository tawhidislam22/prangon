// Prangon Service Worker — production-ready, security-first
// Cache name: bump version to force update
const CACHE_NAME = 'prangon-cache-v1';

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico',
];

// ─── Security helpers ────────────────────────────────────────────────────────

/**
 * Returns true for requests that must NEVER be cached:
 * – Non-GET methods
 * – Auth / API / invitation routes (sensitive data)
 * – Requests carrying Authorization header or cookies
 */
function isSensitiveRequest(request) {
  if (request.method !== 'GET') return true;

  const url = new URL(request.url);
  const sensitivePathPrefixes = ['/api/', '/auth/', '/invitations/'];
  if (sensitivePathPrefixes.some((p) => url.pathname.startsWith(p))) return true;

  if (request.headers.get('Authorization')) return true;
  if (request.headers.get('Cookie')) return true;

  return false;
}

// ─── Install ─────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch strategies ────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Always skip sensitive / non-GET requests — go straight to network
  if (isSensitiveRequest(request)) return;

  const url = new URL(request.url);

  // 1. Next.js immutable static chunks → Cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 2. Images & fonts → Stale-while-revalidate
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 3. Navigation (HTML pages) → Network-first, fallback cache, fallback /offline
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNav(request));
    return;
  }

  // 4. Everything else → Network-first (no cache fallback for unknown resources)
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ─── Strategy implementations ─────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  return cached || networkFetch;
}

async function networkFirstNav(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Last resort — show offline page
    return caches.match('/offline');
  }
}

// ─── Message handler (skip waiting) ──────────────────────────────────────────

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─── Push notifications ───────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'Prangon', body: event.data.text() };
  }

  const title = payload.title || 'Prangon Workspace';
  const options = {
    body: payload.body || 'You have a new notification.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: { url: payload.url || '/' },
    tag: payload.tag || 'prangon-notification',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) return client.focus();
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});

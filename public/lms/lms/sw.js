/**
 * MW Tuition LMS Service Worker (scoped to /lms/)
 * Strict security contract from Blueprint:
 * - Cache ONLY static app shell files.
 * - NEVER cache /api/* responses, student marks, receipts, auth tokens, or watermarked PDFs.
 * - Handle native Web Push notifications even when the app is closed.
 */
const CACHE_NAME = 'mw-lms-shell-v4';
const STATIC_SHELL = [
  '/lms/manifest.webmanifest',
  '/lms/offline.html',
  '/lms/icons/lms-icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'LOGOUT_CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  // NEVER cache API calls, uploads, PDFs, receipts, or auth endpoints
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/uploads/') ||
    url.pathname.endsWith('.pdf')
  ) {
    return;
  }

  // Navigation requests: network first with offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/lms/offline.html')),
    );
    return;
  }

  // Static assets within origin
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (
            res &&
            res.status === 200 &&
            (url.pathname.startsWith('/lms/') || url.pathname.startsWith('/assets/'))
          ) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        });
      }),
    );
  }
});

// ==========================================
// Native Mobile Web Push Notification Events
// ==========================================
self.addEventListener('push', (event) => {
  let payload = {
    title: 'MW Tuition LMS',
    body: 'You have a new update from Sir.',
    url: '/lms/notifications',
  };

  if (event.data) {
    try {
      payload = Object.assign(payload, event.data.json());
    } catch {
      payload.body = event.data.text();
    }
  }

  const title = payload.title || 'MW Tuition LMS';
  const options = {
    body: payload.body,
    icon: payload.icon || '/lms/icons/logo.svg',
    badge: payload.badge || '/lms/icons/logo.svg',
    vibrate: [200, 100, 200, 100, 300],
    tag: payload.tag || 'mw-tuition-alert',
    renotify: true,
    data: {
      url: payload.url || '/lms/notifications',
      ...(payload.data || {}),
    },
    actions: [
      { action: 'open', title: 'Open LMS' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetPath = (event.notification.data && event.notification.data.url) || '/lms/notifications';
  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing open tab if available
      for (const client of windowClients) {
        if (client.url.includes('/lms/') && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Open new window/PWA instance if app was closed
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});

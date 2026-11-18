/**
 * MW Tuition LMS Service Worker (scoped to /lms/)
 * Strict security contract from Blueprint:
 * - Cache ONLY static app shell files.
 * - NEVER cache /api/* responses, student marks, receipts, auth tokens, or watermarked PDFs.
 */
const CACHE_NAME = 'mw-lms-shell-v1';
const STATIC_SHELL = [
  '/lms/manifest.webmanifest',
  '/lms/offline.html',
  '/lms/icons/lms-icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_SHELL)),
  );
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


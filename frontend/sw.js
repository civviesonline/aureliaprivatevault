/*
  Aurelia Private Vault PWA Service Worker (hardened)

  Security goals:
  - Do NOT cache authentication or sensitive API responses
  - Do NOT intercept/modify login or auth requests
  - Do NOT inject/modify HTML
  - Do NOT modify network requests (no header rewriting)
  - Cache only the static app shell and a few immutable assets
*/

const CACHE_NAME = 'aurelia-pwa-v15';

// Cache only the minimal static shell needed for offline rendering.
// No HTML rewriting; only direct put() of successful GET responses.
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './assets/icon-180.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon.svg',
  './assets/relationship-manager-headshot.svg',
];

// Endpoints to never cache.
// (Auth backend includes cookie-based session restore, which must not be cached.)
const SENSITIVE_PATH_PREFIXES = [
  '/api/v1/auth',
  '/auth',
  '/login',
  '/logout',
  '/send-otp',
  '/verify-otp',
  '/register',
  '/session',
];

function isSensitiveRequest(requestUrl) {
  const path = requestUrl.pathname || '';
  return SENSITIVE_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
}

function shouldIgnoreRequest(event) {
  // Only handle GET.
  if (event.request.method !== 'GET') return true;

  const requestUrl = new URL(event.request.url);

  // Only same-origin.
  if (requestUrl.origin !== self.location.origin) return true;

  // Never touch sensitive paths.
  if (isSensitiveRequest(requestUrl)) return true;

  // Never cache responses that include credentials/cookies.
  // (Auth session cookies are HttpOnly; still, fetch may carry credentials.)
  const credentials = event.request.credentials;
  if (credentials === 'include' || credentials === 'same-origin') {
    // Note: navigation GETs here typically use same-origin include=false by default.
    // This is still a conservative hardening rule.
    return true;
  }

  return false;
}

async function putInCache(request, response) {
  // Only cache successful same-origin GET responses.
  if (!response || !response.ok) return response;

  // Do not cache opaque responses.
  if (response.type === 'opaque') return response;

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL.map((path) => new Request(path, { cache: 'reload' }))))
      .then(() => {
        // No-op: no HTML rewriting/injection.
      }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // Conservative ignore policy.
  if (shouldIgnoreRequest(event)) return;

  const requestUrl = new URL(event.request.url);

  // Navigation requests: network-first, with offline fallback to cached app shell.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => putInCache(event.request, response))
        .catch(async () => {
          const cachedIndex = await caches.match('./index.html');
          return cachedIndex || new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }),
    );
    return;
  }

  // For assets: cache-first.
  event.respondWith(
    caches.match(event.request).then(async (cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => putInCache(event.request, response))
        .catch(() => {
          // If an asset is missing, do not fallback to HTML here.
          // Returning a 504 keeps behavior explicit.
          return new Response('', { status: 504 });
        });
    }),
  );
});


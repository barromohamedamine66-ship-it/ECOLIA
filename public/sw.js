/**
 * ÉCOLIA SaaS - Service Worker PWA
 * Gestion du cache hors ligne et rapidité d'affichage mobile
 */

const CACHE_NAME = 'ecolia-pwa-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Installation : Mise en cache des ressources critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch : Stratégie Network-First avec fallback Cache pour les pages
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Stratégie Cache-First pour les icônes et polices statiques
  if (event.request.url.includes('/icons/') || event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Network-First pour les pages et l'API
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match('/');
        });
      })
  );
});

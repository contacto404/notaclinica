const CACHE_NAME = 'notaclinica-v2'
const STATIC_ASSETS = ['/', '/login', '/manifest.json', '/icon-192x192.png', '/icon-512x512.png']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  // Nunca cachear API ni autenticación (evita datos/sesiones viejas)
  if (url.pathname.startsWith('/api/')) return

  // Navegaciones (HTML): network-first, cae a cache solo sin conexión
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then((r) => r || caches.match('/')))
    )
    return
  }

  // Estáticos: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {})
        }
        return res
      })
    })
  )
})

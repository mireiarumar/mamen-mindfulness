// Service worker básico para Mamen Mindfulness PWA
// Estrategia: cache-first para assets estáticos, network-first para todo lo demás.

const VERSION = 'v1'
const CACHE_NAME = `mamen-mindfulness-${VERSION}`
const PRECACHE = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // No interceptar peticiones a Supabase ni audios externos (streaming)
  if (url.origin !== self.location.origin) return
  if (url.pathname.endsWith('.mp3')) return

  event.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone()
        caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(req).then(r => r ?? caches.match('/'))),
  )
})

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('sih-cache-v1').then(cache => cache.addAll(['/'])))
})
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  )
})

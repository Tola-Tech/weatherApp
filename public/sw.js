const cacheName = "cached_v3";
const assets = ["/", "script.js", "style.css", "https://kit.fontawesome.com/19ea530e34.js"];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(assets)
        })
    ) 
})

self.addEventListener("activate", e => {
   e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache != cacheName) {
                        return caches.delete(cache)
                    }
                })
            )
        })
   )
})


self.addEventListener("fetch", e => {
    e.respondWith(
        fetch(e.request).then(res => {
            if(res.status === 200) {
                const clone = res.clone()
                caches.open(cacheName).then(cache => {
                    cache.put(e.request, clone)
                })
            }
            return res;
        }).catch(err => {
            caches.match(e.request).then(catchRes => {
                return catchRes;
            })
        })
    )
})
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('nwm').then(function (cache) {
            return cache.addAll([
                '/',
                '/build/base.css',
                '/build/bundle.js',
                '/build/worker.js',
                '/build/worker-js.js',
                '/build/worker-wasm.js',
                '/build/worker-wasm.wasm',
                '/fonts/fira-mono-v7-latin-regular.eot',
                '/fonts/fira-mono-v7-latin-regular.svg',
                '/fonts/fira-mono-v7-latin-regular.ttf',
                '/fonts/fira-mono-v7-latin-regular.woff',
                '/fonts/fira-mono-v7-latin-regular.woff2',
                '/fonts/MaterialIcons-Regular.eot',
                '/fonts/MaterialIcons-Regular.ttf',
                '/fonts/MaterialIcons-Regular.woff',
                '/fonts/MaterialIcons-Regular.woff2',
                '/fonts/muli-v12-latin-600.woff',
                '/fonts/muli-v12-latin-600.woff2',
                '/fonts/muli-v12-latin-700.woff',
                '/fonts/muli-v12-latin-700.woff2',
                '/fonts/muli-v12-latin-regular.woff',
                '/fonts/muli-v12-latin-regular.woff2',
                '/img/nimiq-style.icons.svg',
            ])
        })
    )
})


self.addEventListener('fetch', (event) => {
    if(event.request.url.indexOf('chrome-extension') >= 0 || event.request.url.indexOf('socket') > 0){
        return // Ignore extensions & socket.io
    }
    event.respondWith(async function() {
        const cache = await caches.open('nwm')
        const cachedResponse = await cache.match(event.request)

        if(event.request.url.match(/api/)){
            let networkResponse
            try {
                networkResponse = await fetch(event.request)
            } catch (e){
                networkResponse = false
            }
            if(networkResponse){
                event.waitUntil(
                    cache.put(event.request, networkResponse.clone())
                )
                return networkResponse
            }
            console.log('Cached api result:', cachedResponse)
            return cachedResponse
        } else {
            if (cachedResponse) return cachedResponse
            const networkResponse = await fetch(event.request)
            event.waitUntil(
                cache.put(event.request, networkResponse.clone())
            )
            return networkResponse
        }
    }())
})
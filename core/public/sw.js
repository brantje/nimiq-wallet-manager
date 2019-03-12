self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('nwm').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
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

self.addEventListener('fetch', function (event) {
    if (event.request.url.indexOf('socket') > 0 || event.request.url.indexOf('api') > 0) {
        return
    }

    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            return cachedResponse || fetch(event.request)
        })
    )
})
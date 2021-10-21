self.addEventListener('install', function (event) {
  // waitUntil -- 确保 service worker 不会在waitUntil里面的代码执行完毕之前安装完成
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/my-service-worker/',
        '/my-service-worker/index.html',
        '/my-service-worker/style.css',
        '/my-service-worker/app.js',
        '/my-service-worker/image-list.js',
        '/my-service-worker/star-wars-logo.jpeg',
        '/my-service-worker/gallery/',
        '/my-service-worker/gallery/bountyHunters.jpeg',
        '/my-service-worker/gallery/myLittleVader.jpeg',
        '/my-service-worker/gallery/snowTroopers.jpeg'
      ])
    })
  )
})

// 每次任何被 service worker 控制的资源被请求到时，都会触发 fetch 事件
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    // cache.match always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone()
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        })
        return response
      }).catch(function () {
        return caches.match('/my-service-worker/gallery/myLittleVader.jpeg');
      })
    }
  }))
})

// 删除旧缓存
self.addEventListener('activate', function (event) {
  var cacheWhitelist = ['v1']

  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key)
        }
      }))
    })
  )
})
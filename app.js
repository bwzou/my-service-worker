if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/my-service-worker/sw.js', { scope: '/my-service-worker/'}).then(function (value) {
    if (value.installing) {
      console.log('Service worker installing')
    } else if (value.waiting) {
      console.log('Service worker installed')
    } else if (value.active) {
      console.log('Service worker active')
    }
  }).catch(function (reason) {
    console.log('Registration failed width ' + reason)
  })
}

function imgLoad(imgJSON) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest()
    request.open('GET', imgJSON.url)
    request.responseType = 'blob'
    request.onload = function (ev) {
      if (request.status == 200) {
        var arrayResponse = []
        arrayResponse[0] = request.response
        arrayResponse[1] = imgJSON
        resolve(arrayResponse)
      } else {
        reject(Error('Image don\'t load successfully, error code: ' + request.statusText))
      }
    }

    request.onerror = function (ev) {
      reject(Error('There was a network error'))
    }

    request.send()
  })
}

var imgSection = document.querySelector('section')

window.onload = function () {
  for (var i = 0; i < Gallery.images.length; i++ ) {
    imgLoad(Gallery.images[i]).then(function (arrayResponse) {
      var myImage = document.createElement('img')
      var myFigure = document.createElement('figure')
      var myCaption = document.createElement('caption')
      var imageUrl = window.URL.createObjectURL(arrayResponse[0])

      myImage.src = imageUrl
      myImage.setAttribute('alt', arrayResponse[1].alt)
      myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit

      imgSection.appendChild(myFigure)
      imgSection.appendChild(myImage)
      imgSection.appendChild(myCaption)
    }, function (reason) {
      console.log(reason)
    })
  }
}


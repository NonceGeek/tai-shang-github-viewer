// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  console.log("registering service worker");
  if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('install', e => {
      console.log("install", e.type)
      window.skipWaiting() // always activate updated SW immediately
    })
    window.addEventListener('activate', e => console.log("activate", e.type))

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        registerValidSW(swUrl, config);
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);
        
        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        // navigator.serviceWorker.ready.then((registration) => {
        //   console.log('Registration succeeded. Scope is ' + registration.scope);
        //   registration.active.postMessage({ code: "get-client-id" });
        //   console.log(
        //     'This web app is being served cache-first by a service ' +
        //     'worker. To learn more, visit http://bit.ly/CRA-PWA'
        //   );
        // });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
        // navigator.serviceWorker.ready.then((registration) => {
        //   console.log('Registration succeeded. Scope is ' + registration.scope);
        //   registration.active.postMessage({ code: "get-client-id" });
        //   console.log(
        //     'This web app is being served cache-first by a service ' +
        //     'worker. To learn more, visit http://bit.ly/CRA-PWA'
        //   );
        // });
      }
    });

    let windowClientId = '';
    let iframeClientId = '';

    window.addEventListener('message', (event) => {
      console.log("=====>message", event.data);
      if (event.data.code === 'get-client-id') {
        window.clients.matchAll().then(function (clients) {
          clients.forEach(function (client) {
            if (client.frameType === "top-level") {
              windowClientId = client.id
            } else if (client.frameType === "nested") {
              iframeClientId = client.id
            }
          });
        });
      }
    });

    window.addEventListener('fetch', async (event) => {
      console.log("=====fetch");
      // Don't process any requests if worker/iframe are not activated fully
      if (!windowClientId || !iframeClientId) {
        return;
      }
      // Don't process main window resources
      if (event.clientId === windowClientId) {
        return;
      }
      // do smth
      const {request} = event;
      const response = await fetch(request);
      // 3.拷贝克隆请求
      // 4.篡改响应头
      response.headers.delete('Content-Security-Policy');
      response.headers.delete('X-Frame-Options');

      event.respondWith(Promise.resolve(response));
    })
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                'tabs for this page are closed. See http://bit.ly/CRA-PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}

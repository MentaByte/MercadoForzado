/* ================================================
   SERVICE WORKER — MercadoLibre Libros
   Estrategia: Cache First con fallback a red
   =============================================== */

const CACHE_NAME = 'ml-libros-v1';

/* Archivos que se cachean inmediatamente al instalar */
const PRECACHE = [
  '/',
  '/index.html',
  '/fenix.html',
  '/manifest.json',
  /* Portadas de los 55 libros */
  '/portadas/1.webp',
  '/portadas/2.webp',
  '/portadas/3.webp',
  '/portadas/4.webp',
  '/portadas/5.webp',
  '/portadas/6.webp',
  '/portadas/7.webp',
  '/portadas/8.webp',
  '/portadas/9.webp',
  '/portadas/10.webp',
  '/portadas/11.webp',
  '/portadas/12.webp',
  '/portadas/13.webp',
  '/portadas/14.webp',
  '/portadas/15.webp',
  '/portadas/16.webp',
  '/portadas/17.webp',
  '/portadas/18.webp',
  '/portadas/19.webp',
  '/portadas/20.webp',
  '/portadas/21.webp',
  '/portadas/22.webp',
  '/portadas/23.webp',
  '/portadas/24.webp',
  '/portadas/25.webp',
  '/portadas/26.webp',
  '/portadas/27.webp',
  '/portadas/28.webp',
  '/portadas/29.webp',
  '/portadas/30.webp',
  '/portadas/31.webp',
  '/portadas/32.webp',
  '/portadas/33.webp',
  '/portadas/34.webp',
  '/portadas/35.webp',
  '/portadas/36.webp',
  '/portadas/37.webp',
  '/portadas/38.webp',
  '/portadas/39.webp',
  '/portadas/40.webp',
  '/portadas/41.webp',
  '/portadas/42.webp',
  '/portadas/43.webp',
  '/portadas/44.webp',
  '/portadas/45.webp',
  '/portadas/46.webp',
  '/portadas/47.webp',
  '/portadas/48.webp',
  '/portadas/49.webp',
  '/portadas/50.webp',
  '/portadas/51.webp',
  '/portadas/52.webp',
  '/portadas/53.webp',
  '/portadas/54.webp',
  '/portadas/55.webp',
];

/* ------------------------------------------------
   INSTALL — precachea todos los archivos esenciales
------------------------------------------------ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Precacheando archivos...');
      /* Cachea cada archivo individualmente para que
         un fallo en uno no rompa toda la instalación */
      return Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(err =>
            console.warn('[SW] No se pudo cachear:', url, err)
          )
        )
      );
    }).then(() => {
      console.log('[SW] Instalación completa');
      /* Activa el SW inmediatamente sin esperar a que
         se cierren las pestañas abiertas */
      return self.skipWaiting();
    })
  );
});

/* ------------------------------------------------
   ACTIVATE — limpia cachés viejas de versiones anteriores
------------------------------------------------ */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Eliminando caché vieja:', key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      console.log('[SW] Activado y en control');
      /* Toma control de todas las páginas abiertas */
      return self.clients.claim();
    })
  );
});

/* ------------------------------------------------
   FETCH — estrategia Cache First
   1. Busca en caché → si existe, lo sirve
   2. Si no está en caché → va a la red y lo guarda
   3. Si la red falla → muestra página offline
------------------------------------------------ */
self.addEventListener('fetch', event => {
  /* Solo intercepta peticiones GET */
  if (event.request.method !== 'GET') return;

  /* No intercepta peticiones a otros dominios
     (excepto imgur que cacheamos si ya está guardado) */
  const url = new URL(event.request.url);
  const isLocal   = url.origin === self.location.origin;
  const isImgur   = url.hostname === 'i.imgur.com';

  if (!isLocal && !isImgur) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        /* ✅ Encontrado en caché — respuesta instantánea */
        return cached;
      }

      /* 🌐 No está en caché — busca en la red */
      return fetch(event.request).then(response => {
        /* Solo cachea respuestas válidas */
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        /* Guarda la respuesta en caché para futuros usos */
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, toCache);
        });

        return response;
      }).catch(() => {
        /* ❌ Sin red y sin caché */
        /* Si es una página HTML, muestra página offline mínima */
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return new Response(
            `<!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Sin conexión</title>
              <style>
                body { font-family: Arial, sans-serif; display: flex; flex-direction: column;
                       align-items: center; justify-content: center; min-height: 100vh;
                       margin: 0; background: #f5f5f5; color: #333; text-align: center; padding: 20px; }
                .logo { font-size: 48px; margin-bottom: 16px; }
                h1 { font-size: 20px; margin-bottom: 8px; }
                p { font-size: 14px; color: #666; max-width: 280px; }
                button { margin-top: 24px; padding: 12px 28px; background: #3483fa;
                         color: #fff; border: none; border-radius: 8px; font-size: 15px;
                         font-weight: 700; cursor: pointer; }
              </style>
            </head>
            <body>
              <div class="logo">📚</div>
              <h1>Sin conexión</h1>
              <p>No hay internet. Abre la app una vez con conexión para que funcione offline.</p>
              <button onclick="location.reload()">Reintentar</button>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }

        /* Para imágenes sin caché y sin red, retorna respuesta vacía */
        return new Response('', { status: 503 });
      });
    })
  );
});

/* ------------------------------------------------
   MESSAGE — permite forzar actualización del SW
   desde la app con: navigator.serviceWorker.controller
   .postMessage({ type: 'SKIP_WAITING' })
------------------------------------------------ */
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/*
const CACHE_NAME = "victoria-v2.4";
const STATIC_ASSETS = [
  "./",
  "./assets/css/global/variables.css",
  "./assets/css/global/variables-dark.css",
  "./assets/css/global/global.css",
  "./assets/css/responsividade.css",
  "./assets/js/tema-boot.js",
  "./assets/js/utils/tema.js",
  "./assets/js/global.js",
  "./assets/js/auth.js",
  "./assets/img/logos/logo-victoria.webp",
  "./assets/img/favicon/icon-victoria.ico",
  "./assets/img/global/bg-global-dark.jpg",
  "./assets/img/global/bg-hero-section-dark.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(STATIC_ASSETS.map(async (caminho) => {
        const resposta = await fetch(caminho, { cache: "reload" });

        if (!resposta.ok) throw new Error(`Falha ao cachear ${caminho}`);
        await cache.put(caminho, resposta);
      }));
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.pathname.includes("/api/")) {
    return;
  }

  if (request.headers.get("Accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request, { cache: "reload" })
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match("./pages/404.php");
          });
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {

      if (cached) return cached;

      return fetch(request, { cache: "reload" }).then((response) => {

        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }

        return response;
      });
    }),
  );
});
*/
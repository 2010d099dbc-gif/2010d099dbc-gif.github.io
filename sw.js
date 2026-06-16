const SHELL = "nichiwa-shell-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  // 加密内容（data.bin / img / docs / files）一律走网络，绝不缓存
  if (/\.bin$/.test(u.pathname) || u.pathname.includes("/files/") || u.pathname.includes("/docs/")) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});

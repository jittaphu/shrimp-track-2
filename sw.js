// ไฟล์หนัก (โมเดล .onnx, .wasm, ไลบรารี) ใช้แคชก่อน จะได้ไม่โหลดซ้ำทุกครั้ง
// ถ้าเปลี่ยนไฟล์ best.onnx ให้เพิ่มเลขเวอร์ชันของ C (เช่น v2) แล้วอัปโหลดใหม่
const C = "shrimptrack-yolo-v1";
addEventListener("install", e => { e.waitUntil(caches.open(C).then(c =>
  c.addAll(["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"]))); skipWaiting(); });
addEventListener("activate", e => e.waitUntil(caches.keys().then(ks =>
  Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))));
const heavy = u => /\.(onnx|wasm)$|jsdelivr/.test(u);
addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const put = r => { if (r.ok || r.type === "opaque") { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)).catch(() => {}); } return r; };
  e.respondWith(heavy(e.request.url)
    ? caches.match(e.request).then(m => m || fetch(e.request).then(put))
    : fetch(e.request).then(put).catch(() => caches.match(e.request)));
});

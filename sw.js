// Bacher Hub service worker: keeps the app shell available and updates it in the background.
const CACHE='bacher-hub-v20';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).then(()=>fetch(LIB,{mode:'cors'}).then(r=>r.ok&&c.put(LIB,r)).catch(()=>{}))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method==='GET'&&url.hostname==='cdn.jsdelivr.net'){ // the database library: keep a copy so the app can start offline
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(hit=>{const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);return hit||net})));return}
  if(e.request.method!=='GET'||url.origin!==self.location.origin)return; // data goes straight to Supabase
  // network first so updates arrive, cache as the fallback when offline
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
// Next-day assignment alerts
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'Bacher Hub',{body:d.body||'',tag:d.tag||'bacher-hub',icon:'icons/icon-192.png',badge:'icons/icon-192.png',data:{url:d.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.startsWith(self.registration.scope)&&'focus' in c){c.navigate&&c.url!==url&&c.navigate(url).catch(()=>{});return c.focus()}}return self.clients.openWindow(url)}))});

"use strict";var precacheConfig=[["app.9abaaa97626149dcbe7bef017debb594.css","3522d22edd7da05f3fc40f91508c043b"],["fonts/MaterialIcons-Regular.012cf6a.woff","012cf6a10129e2275d79d6adac7f3b02"],["index.html","99d64df738c8480a25e179aad43f7e23"],["js/app.js","4026defb86d060c7b91c6721909705b8"],["js/manifest.js","e450de1eb79f964013f5fbf9cc6bb7ef"],["js/vendor.js","723b07c83510adc9d0c7868f3b84bd7f"],["statics/icons/apple-icon-152x152.png","e237052830d9eb5fefcf90cc284294c2"],["statics/icons/favicon-16x16.png","23bea3e13ee335c980ffb8cb495073fa"],["statics/icons/favicon-32x32.png","7e636d9c82bdb355bba6c2142c8369dd"],["statics/icons/icon-192x192.png","e237052830d9eb5fefcf90cc284294c2"],["statics/icons/icon-512x512.png","8edf9e45e27cc1fdd7bd99e576e43095"],["statics/icons/ms-icon-144x144.png","e237052830d9eb5fefcf90cc284294c2"],["statics/manifest.json","d6cc7d8177315811547a0958c1a095b8"],["statics/quasar-logo.png","3020c8ac2c2872dec7741e5948520093"]],cacheName="sw-precache-v3-my-quasar-app-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,n){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=n),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,n,t,r){var c=new URL(e);return r&&c.pathname.match(r)||(c.search+=(c.search?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(t)),c.toString()},isPathWhitelisted=function(e,n){if(0===e.length)return!0;var t=new URL(n).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return n.every(function(n){return!n.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var n=e[0],t=e[1],r=new URL(n,self.location),c=createCacheKey(r,hashParamName,t,!1);return[r.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var r=new Request(t,{credentials:"same-origin"});return fetch(r).then(function(n){if(!n.ok)throw new Error("Request for "+t+" returned a response with status "+n.status);return cleanResponse(n).then(function(n){return e.put(t,n)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!n.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var n,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),r="index.html";(n=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,r),n=urlsToCacheKeys.has(t));0,n&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(n){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,n),fetch(e.request)}))}});
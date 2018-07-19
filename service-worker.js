/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "e7868b01bfa97e39f90c4ed0d544bb70"
  },
  {
    "url": "assets/css/0.styles.ab0b4dc1.css",
    "revision": "1d1fa39075e240ba43035e2942983191"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.99de000b.js",
    "revision": "e15728e841b0da40602184dbccf1bad9"
  },
  {
    "url": "assets/js/10.3054ef33.js",
    "revision": "4cd5c03bbae79f4ce8088d7700a98578"
  },
  {
    "url": "assets/js/11.b4200c59.js",
    "revision": "12409e3e21648c55683e2c4f3643b170"
  },
  {
    "url": "assets/js/2.e447de1f.js",
    "revision": "744adacf3c9deac8bad6eb899e73603b"
  },
  {
    "url": "assets/js/3.4944df20.js",
    "revision": "46b40f2aa1e987efd27205a507bcf405"
  },
  {
    "url": "assets/js/4.71d96e36.js",
    "revision": "26bce6836beed938232263a1255ed61e"
  },
  {
    "url": "assets/js/5.10704e8b.js",
    "revision": "ca014b3bcbe48a108b9fcb0277be19e6"
  },
  {
    "url": "assets/js/6.ec178c3c.js",
    "revision": "d5d5be7547052e75c06d4ff7e1c2dc3a"
  },
  {
    "url": "assets/js/7.3d250d9b.js",
    "revision": "1975d36870af7caac5cab3b6aa966157"
  },
  {
    "url": "assets/js/8.445acb43.js",
    "revision": "1fbf6b675d3cba72094a01da1b972422"
  },
  {
    "url": "assets/js/9.b5b2171f.js",
    "revision": "fffb7bb5cef3e33101db3d996c572657"
  },
  {
    "url": "assets/js/app.5eceb5f8.js",
    "revision": "070ed2fa53368d7301756b4d2ebc713a"
  },
  {
    "url": "index.html",
    "revision": "836d4aa27c55a72c7c134da7523408c0"
  },
  {
    "url": "logs.vue.png",
    "revision": "36726c2570db141e6f4593beacc00427"
  },
  {
    "url": "open-by-tab.png",
    "revision": "e69bef4cd9a67a0c3f9f1e8687aea260"
  },
  {
    "url": "quick-start/components.html",
    "revision": "3dad9637778809a83f966bc33e856f5f"
  },
  {
    "url": "quick-start/computed.html",
    "revision": "27e9865d2a408d5225c466ce364d83ed"
  },
  {
    "url": "quick-start/index.html",
    "revision": "eab902229995cd4fd5300329c00a4c98"
  },
  {
    "url": "quick-start/installation.html",
    "revision": "ef6f1e3ecb5bcd6617590b72d6167891"
  },
  {
    "url": "quick-start/instance.html",
    "revision": "7b05c1a3a373d8a87929e03ceedd0121"
  },
  {
    "url": "quick-start/simple-app.html",
    "revision": "6a41255f1ca9248003251921d260de9b"
  },
  {
    "url": "quick-start/vue-app.html",
    "revision": "2ba530e4b676c8d8155c85900d126610"
  },
  {
    "url": "standard.svg",
    "revision": "92650602b63995390fc74b25ea4bd501"
  },
  {
    "url": "tua-mp-service/index.html",
    "revision": "f5a75fb70948560a5a324f93d52b8e8d"
  },
  {
    "url": "tua-mp-todos.gif",
    "revision": "af6507fd57a69eec3d067f5fa0940b05"
  },
  {
    "url": "tua-storage/index.html",
    "revision": "3950f3eabd1e96e3396198c6d4a9d8aa"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

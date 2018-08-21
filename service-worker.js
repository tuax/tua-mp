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
    "revision": "57fbbdf6964457dbdb5ebfebebc2de62"
  },
  {
    "url": "assets/css/0.styles.7dc82457.css",
    "revision": "b116b14407227d4564d2fac20654ce60"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.7f4ae768.js",
    "revision": "c7034ebd3836330279e450ca60d2ec41"
  },
  {
    "url": "assets/js/11.b1242211.js",
    "revision": "d6240c112f33f35dc8b0bf34afc9c345"
  },
  {
    "url": "assets/js/12.4726b65b.js",
    "revision": "9f2d3a82feee457738ee8f6d18cd6ae0"
  },
  {
    "url": "assets/js/13.e3386c30.js",
    "revision": "e039a17abb437c931ed408043cbf6a5d"
  },
  {
    "url": "assets/js/2.ea010887.js",
    "revision": "2402e7b40bef5a6de37856d3c0eb6223"
  },
  {
    "url": "assets/js/3.e1597925.js",
    "revision": "837f894ea46e1e1833ddfe9c0147aa5f"
  },
  {
    "url": "assets/js/4.1cda87d5.js",
    "revision": "96efdd8c91407dfe8b86c19a44801951"
  },
  {
    "url": "assets/js/5.ff9a8af9.js",
    "revision": "2aa639e4315de84e0dfcbdf24fd5678e"
  },
  {
    "url": "assets/js/6.7d92d182.js",
    "revision": "3914edcf955837d6424316bd9a775377"
  },
  {
    "url": "assets/js/7.0c9bc5bf.js",
    "revision": "45166ed1155d2103f0df06f40dc98fdf"
  },
  {
    "url": "assets/js/8.fc024bbc.js",
    "revision": "0d7ffab521cf90a4da20d86f8863eaac"
  },
  {
    "url": "assets/js/9.572a97b1.js",
    "revision": "323ba7fdd51baedce516d393be6cfb01"
  },
  {
    "url": "assets/js/app.3024dd90.js",
    "revision": "562c9bfb30c8cb77b43aa010afff2c45"
  },
  {
    "url": "cli/add-api.gif",
    "revision": "8763ffafed8c95f7861270f3ae827aa8"
  },
  {
    "url": "cli/add-comp-global.gif",
    "revision": "ff66fb36073e1c8dd16c2388ed6ab66c"
  },
  {
    "url": "cli/add-comp-local.gif",
    "revision": "15c132eba086ddd8295f12bbc0e731b6"
  },
  {
    "url": "cli/add-page.gif",
    "revision": "cd7de4f55ddba37409ace99ab1f9e999"
  },
  {
    "url": "index.html",
    "revision": "aad1d65721ca267e008c6c810185416d"
  },
  {
    "url": "logo.png",
    "revision": "7f5f5300ded88b992de697c61021a507"
  },
  {
    "url": "logs.vue.png",
    "revision": "36726c2570db141e6f4593beacc00427"
  },
  {
    "url": "quick-start/components.html",
    "revision": "deb08f0f677685dc25d3b465ead076d6"
  },
  {
    "url": "quick-start/computed.html",
    "revision": "1ac7cf9fe8ad419c4c3e6e943e70200c"
  },
  {
    "url": "quick-start/index.html",
    "revision": "a50530f0188fc90fb2375ec5fdd4677a"
  },
  {
    "url": "quick-start/installation.html",
    "revision": "56d63e3764aa927f91d67f0a9a3e3b14"
  },
  {
    "url": "quick-start/instance.html",
    "revision": "5170b938c5869c9862b1fe245c5b32ca"
  },
  {
    "url": "quick-start/simple-app.html",
    "revision": "8261c1018e20204abe9c8ded1832538a"
  },
  {
    "url": "quick-start/vue-app.html",
    "revision": "9a91e46a076aabe36f9afbe8fdb8ee13"
  },
  {
    "url": "standard.svg",
    "revision": "92650602b63995390fc74b25ea4bd501"
  },
  {
    "url": "tua-mp-cli/index.html",
    "revision": "64c612085fc4a86503d1b9dcd488e614"
  },
  {
    "url": "tua-mp-service/index.html",
    "revision": "49fd0f8591662246eb85b1649dec4e47"
  },
  {
    "url": "tua-mp-todos.gif",
    "revision": "af6507fd57a69eec3d067f5fa0940b05"
  },
  {
    "url": "tua-storage/index.html",
    "revision": "fd52c90ef4f242954aa1f3ea78339bc8"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

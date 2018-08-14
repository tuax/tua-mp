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
    "revision": "eef86c27d90960d7bbc111df833125f6"
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
    "url": "assets/js/10.ce3469ac.js",
    "revision": "99b9020548b4787f17043f392f6cf117"
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
    "url": "assets/js/9.6f3e557a.js",
    "revision": "2a339972718fdc78da7582cdaf5efb20"
  },
  {
    "url": "assets/js/app.68d11b5c.js",
    "revision": "30dfa6458f0ce718e8332518a18af1ac"
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
    "revision": "fa7ae38b7cd31931d981b1b1a095ed4a"
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
    "revision": "947ca1e18e4439d699f3bfe918a03306"
  },
  {
    "url": "quick-start/computed.html",
    "revision": "6c830fcccd33787768385b44ce2d145d"
  },
  {
    "url": "quick-start/index.html",
    "revision": "28104c60aa626fe7f31183a38e0bf1eb"
  },
  {
    "url": "quick-start/installation.html",
    "revision": "0683b069cb5df38036e8c873687dfd0a"
  },
  {
    "url": "quick-start/instance.html",
    "revision": "ecccd75ab9262be673d42632d076d6a4"
  },
  {
    "url": "quick-start/simple-app.html",
    "revision": "46b9cc921710b9237f203fd757eed057"
  },
  {
    "url": "quick-start/vue-app.html",
    "revision": "d0bc0525f82dcd262842f5562934129c"
  },
  {
    "url": "standard.svg",
    "revision": "92650602b63995390fc74b25ea4bd501"
  },
  {
    "url": "tua-mp-cli/index.html",
    "revision": "9dcd26b1964d536fe1ffe12f35b8f9a4"
  },
  {
    "url": "tua-mp-service/index.html",
    "revision": "149b1d15bfbd7f91866871fab1acf587"
  },
  {
    "url": "tua-mp-todos.gif",
    "revision": "af6507fd57a69eec3d067f5fa0940b05"
  },
  {
    "url": "tua-storage/index.html",
    "revision": "7e7579657747ffa8a94a928e6a971a91"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

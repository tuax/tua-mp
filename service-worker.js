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
    "revision": "6ff1f338a693e432d69bcbcf85b6073d"
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
    "url": "assets/js/10.924724b0.js",
    "revision": "09313702082bf64b6b41e3c933de9929"
  },
  {
    "url": "assets/js/11.a816d60e.js",
    "revision": "54d2be23d334f77586cd6a1b2a491bb5"
  },
  {
    "url": "assets/js/12.a1765619.js",
    "revision": "8d5973c16276b5bd8fa83687d9da7422"
  },
  {
    "url": "assets/js/2.ea010887.js",
    "revision": "2402e7b40bef5a6de37856d3c0eb6223"
  },
  {
    "url": "assets/js/3.a3064b94.js",
    "revision": "19db2a06937d23d673142c51ed707769"
  },
  {
    "url": "assets/js/4.e82c95cc.js",
    "revision": "a27567a2e113d3c5f8b711353b0f33e6"
  },
  {
    "url": "assets/js/5.728ec6d7.js",
    "revision": "01898931cbed518537647c880c504602"
  },
  {
    "url": "assets/js/6.8c35aaed.js",
    "revision": "1420ec9a202b93d8875f3a847f2a77c0"
  },
  {
    "url": "assets/js/7.6c34fc1c.js",
    "revision": "9007258c4013e996cff760d270fcedba"
  },
  {
    "url": "assets/js/8.6f5afc83.js",
    "revision": "73853698528d57e1335f9cce4c931481"
  },
  {
    "url": "assets/js/9.0d6a606d.js",
    "revision": "e507723152b016589386f6dc1b31c294"
  },
  {
    "url": "assets/js/app.b6cf0688.js",
    "revision": "ea894b12628a1d5fec54b388c3eb9e86"
  },
  {
    "url": "cli/add-api.gif",
    "revision": "519723a82a656287ca38a55551478266"
  },
  {
    "url": "cli/add-comp-global.gif",
    "revision": "7d1c35f880cfedad096c141ed313e665"
  },
  {
    "url": "cli/add-comp-local.gif",
    "revision": "7743f4aa710f7ef12e04b0c7c1bb8d90"
  },
  {
    "url": "cli/add-page.gif",
    "revision": "a3953c1ed567a27ddec21697fe38d7c6"
  },
  {
    "url": "index.html",
    "revision": "9cb2f2d2348a7522b478f646a3401b79"
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
    "revision": "4582b04e47d8b30af40f287c350f687b"
  },
  {
    "url": "quick-start/computed.html",
    "revision": "5e862c15e979909fa77c16d01d80050e"
  },
  {
    "url": "quick-start/index.html",
    "revision": "5715da941fde7212b04934977faf10d2"
  },
  {
    "url": "quick-start/installation.html",
    "revision": "0c8dc7d7046ec5f59d62093c6f14a175"
  },
  {
    "url": "quick-start/instance.html",
    "revision": "392402a84aac9a93a856031dc3f1615a"
  },
  {
    "url": "quick-start/simple-app.html",
    "revision": "6d411026b7a26a98096bf17ef90b3e6a"
  },
  {
    "url": "quick-start/vue-app.html",
    "revision": "a33ec7feb53e70cc80091dbf5302a49b"
  },
  {
    "url": "standard.svg",
    "revision": "92650602b63995390fc74b25ea4bd501"
  },
  {
    "url": "tua-mp-cli/index.html",
    "revision": "30c5b73613a0972a2d29da89dffee003"
  },
  {
    "url": "tua-mp-service/index.html",
    "revision": "332d2ee1492a17aacffef8b76d26c6fb"
  },
  {
    "url": "tua-mp-todos.gif",
    "revision": "af6507fd57a69eec3d067f5fa0940b05"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

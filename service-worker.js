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
    "revision": "8578d6b645a51a47975f7e04fda9183b"
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
    "url": "assets/js/3.59b60eb5.js",
    "revision": "43a48043048a89a6c6770d3246d178fb"
  },
  {
    "url": "assets/js/4.111ad705.js",
    "revision": "00e8fc554509dafc8a78d561a4e068ab"
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
    "url": "assets/js/app.1a2f9348.js",
    "revision": "9e3fc71833385b84fd34f8d96bb13c68"
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
    "revision": "644d0a5e3f1c3e332f56ee0c4b2d3fcf"
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
    "revision": "43e2106ac6c413fe12a484ac5c4d50d1"
  },
  {
    "url": "quick-start/computed.html",
    "revision": "81dd5f4f23568d5d380c214c2b3bd7c4"
  },
  {
    "url": "quick-start/index.html",
    "revision": "118cbb2de1ba7a56bd89822154076b40"
  },
  {
    "url": "quick-start/installation.html",
    "revision": "ff7071640b08bba4d4998292a8971999"
  },
  {
    "url": "quick-start/instance.html",
    "revision": "e916139baa2194e8111e806b9bb73c5b"
  },
  {
    "url": "quick-start/simple-app.html",
    "revision": "f788a60c300fccc7c3ab95ade64239ae"
  },
  {
    "url": "quick-start/vue-app.html",
    "revision": "ddac8006e4c0719a069195277de5f648"
  },
  {
    "url": "standard.svg",
    "revision": "92650602b63995390fc74b25ea4bd501"
  },
  {
    "url": "tua-mp-cli/index.html",
    "revision": "8d5c814b9786207b2f577bf7140d149b"
  },
  {
    "url": "tua-mp-service/index.html",
    "revision": "16d1a0b80be7f7a5f366cb5641c59cd4"
  },
  {
    "url": "tua-mp-todos.gif",
    "revision": "af6507fd57a69eec3d067f5fa0940b05"
  },
  {
    "url": "tua-storage/index.html",
    "revision": "031ccb2f5990e107c52fad9e3fc30049"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

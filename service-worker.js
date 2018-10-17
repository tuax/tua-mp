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
    "revision": "582987c4dbe04085661802a3b1a3bdd8"
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
    "url": "assets/js/11.9f4087eb.js",
    "revision": "b890a2f33e07829e4d4171756dd7df3f"
  },
  {
    "url": "assets/js/12.4726b65b.js",
    "revision": "9f2d3a82feee457738ee8f6d18cd6ae0"
  },
  {
    "url": "assets/js/13.386fa0d6.js",
    "revision": "c8dc05c57fea19ac21b0ca4942244c54"
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
    "url": "assets/js/app.a0c5ea57.js",
    "revision": "700b131b4a5e081241d09d38334c6668"
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
    "revision": "717313659c93d25528b82283371b0727"
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
    "revision": "1ca396e4bf9283e4645b279fb764466f"
  },
  {
    "url": "quick-start/computed.html",
    "revision": "f9edc2f17136d2cce9c3e8d14000c385"
  },
  {
    "url": "quick-start/index.html",
    "revision": "d9d18e8a3c3b8c344446d6f1c586e055"
  },
  {
    "url": "quick-start/installation.html",
    "revision": "effde6e3bcfec137d5285d1096a65bb9"
  },
  {
    "url": "quick-start/instance.html",
    "revision": "bda874b64f1bbe6f1163474fdb5959ef"
  },
  {
    "url": "quick-start/simple-app.html",
    "revision": "3c91e6c53b9855b89a9b5d3ffad04cf6"
  },
  {
    "url": "quick-start/vue-app.html",
    "revision": "ddb50a820a0258ca645ef81878723785"
  },
  {
    "url": "standard.svg",
    "revision": "92650602b63995390fc74b25ea4bd501"
  },
  {
    "url": "tua-mp-cli/index.html",
    "revision": "ead36417698835bf1a11e0b8a20dd27b"
  },
  {
    "url": "tua-mp-service/index.html",
    "revision": "6b3f723f3b8c7af342867e14e58ef93b"
  },
  {
    "url": "tua-mp-todos.gif",
    "revision": "af6507fd57a69eec3d067f5fa0940b05"
  },
  {
    "url": "tua-storage/index.html",
    "revision": "b9df074a37d525ba4939b12afe66a9d4"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

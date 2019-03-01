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
    "revision": "c816b75dd684abf54d5b449cbd0e0d5d"
  },
  {
    "url": "assets/css/0.styles.1730947d.css",
    "revision": "a14b6aa603a4adaae85a2e479a660e56"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.9aa52729.js",
    "revision": "7a2e11e4baf57b3575a27b4c13e03dbf"
  },
  {
    "url": "assets/js/11.877cca5f.js",
    "revision": "4f3f98016400edae6142358ad4264df9"
  },
  {
    "url": "assets/js/12.eb1c7571.js",
    "revision": "71125155c67fa8818e661dd2af59b534"
  },
  {
    "url": "assets/js/13.51bc11d3.js",
    "revision": "40c540329b6e542e6d5596913c201d3e"
  },
  {
    "url": "assets/js/2.285762ea.js",
    "revision": "93afbd4e91ed17280e84a6930dc81b17"
  },
  {
    "url": "assets/js/3.e16feeac.js",
    "revision": "f4f168d63b2d6e6f31f257af490f5248"
  },
  {
    "url": "assets/js/4.4f891bcb.js",
    "revision": "923cbbf94ba520338b9fab833242e196"
  },
  {
    "url": "assets/js/5.cb68f8c4.js",
    "revision": "8fd36c6cef8488b7c82449d7cb9633ec"
  },
  {
    "url": "assets/js/6.0862bcef.js",
    "revision": "30fc3b1e7ff57f603b22d8ddf5d50656"
  },
  {
    "url": "assets/js/7.4a03cad2.js",
    "revision": "3cab85d32674a15201eec95f25ff2b81"
  },
  {
    "url": "assets/js/8.1b914b35.js",
    "revision": "d1dbd5f0ece251c7768dba98632a5e9a"
  },
  {
    "url": "assets/js/9.d29f3c33.js",
    "revision": "316af979424767fc673bf2e36437cc20"
  },
  {
    "url": "assets/js/app.85f6046a.js",
    "revision": "8269a521fe676315213c30e64cb06bae"
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
    "revision": "ddaf3fbfff2b1e1ff212ea91ae024c1b"
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
    "revision": "bca8872e13d2084a094253c991044846"
  },
  {
    "url": "quick-start/computed.html",
    "revision": "30ff483b6fa1bbbb21f9849074599e7c"
  },
  {
    "url": "quick-start/index.html",
    "revision": "5a13fafad9eb9d0f5f4f1e9b8a64972b"
  },
  {
    "url": "quick-start/installation.html",
    "revision": "cf526b98e2f19869a52c2f3f7894f897"
  },
  {
    "url": "quick-start/instance.html",
    "revision": "614f16a91f87b2c5d8198c4269f4c621"
  },
  {
    "url": "quick-start/simple-app.html",
    "revision": "2863b64cd18cbac72cfecf8319bd1321"
  },
  {
    "url": "quick-start/vue-app.html",
    "revision": "36b61545c33475b16a55fbc300108c8d"
  },
  {
    "url": "standard.svg",
    "revision": "92650602b63995390fc74b25ea4bd501"
  },
  {
    "url": "tua-mp-cli/index.html",
    "revision": "ee5edecb0e9e672da07addc7b37cfd4c"
  },
  {
    "url": "tua-mp-service/index.html",
    "revision": "fa2691de255c385d0e9bd46766e79c6a"
  },
  {
    "url": "tua-mp-todos.gif",
    "revision": "af6507fd57a69eec3d067f5fa0940b05"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})

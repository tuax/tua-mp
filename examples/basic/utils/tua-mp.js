!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.TuaMp={})}(this,function(t){"use strict";var e=/^__.*__$/,h={enumerable:!0,configurable:!0},b="__TUA_PATH",v=function(t){return"function"==typeof t},y=function(t){return!e.test(t)},d=function(t,e){return""===t?e:t+"."+e},O=function(e,n){Object.keys(e).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(e,t))})},j=Array.prototype,m=["pop","push","sort","shift","splice","unshift","reverse"],g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},r=function(){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}}(),P=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},w=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},_=function(){function t(){n(this,t),this.subs=[]}return r(t,[{key:"addSub",value:function(t){-1<this.subs.indexOf(t)||this.subs.push(t)}},{key:"notify",value:function(){this.subs.slice().forEach(function(t){return t()})}}]),t}(),D=_.targetCb=null,S=null,A=null,k=function(t){var o=t.obj,a=t.key,i=t.val,u=t.observeDeep,c=t.asyncSetData,f=new _;Object.defineProperty(o,a,w({},h,{get:function(){return _.targetCb&&f.addSub(_.targetCb),i},set:function(t){if(t!==i){var e=i,n=o[b]||"",r=d(n,a);i=u(t,r),c({path:r,newVal:t,oldVal:e}),f.notify()}}}))},V=function(p){return function n(e){var t,r,o,a,u,c,f,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"";if(Array.isArray(e)){var l=e.map(function(t,e){return n(t,i+"["+e+"]")});return l[b]=i,A=A||(u=(a={observeDeep:n,asyncSetData:p}).observeDeep,c=a.asyncSetData,f=Object.create(j),m.forEach(function(a){var i=j[a];f[a]=function(){for(var t=this[b],e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];var o=i.apply(this,n);return c("pop"===a?{path:t,newVal:this}:{path:t,newVal:u(this,t),isArrDirty:!0}),o}}),f),r=(t={arr:l,arrayMethods:A}).arr,o=t.arrayMethods,Object.setPrototypeOf?Object.setPrototypeOf(r,o):"__proto__"in r?r.__proto__=o:O(o,r),r}if("object"===(void 0===e?"undefined":g(e))){var s=Object.create(null);return Object.defineProperty(s,b,{enumerable:!1,value:i}),Object.keys(e).filter(y).map(function(t){return{obj:s,key:t,val:n(e[t],d(i,t)),observeDeep:n,asyncSetData:p}}).forEach(k),s}return e}};console.log("[TUA-MP]: Version 0.5.3");t.TuaPage=function(t){var e=t.data,n=t.watch,b=void 0===n?{}:n,r=t.methods,o=void 0===r?{}:r,a=t.computed,y=void 0===a?{}:a,d=function(t,e){var n={};for(var r in t)0<=e.indexOf(r)||Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n}(t,["data","watch","methods","computed"]),i=v(e)?e():e;return Page(w({},d,o,{data:i,onLoad:function(){var s,p,t,e,a,i,u,c,n=(s=this,p=b,function(t){var e,n,r,o,a,i=t.path,u=t.newVal,c=t.oldVal,f=t.isArrDirty,l=void 0!==f&&f;D=w({},D,P({},i,u)),S=w(P({},i,c),S),l&&(r=(e={obj:s,val:u,path:i}).obj,o=e.path,a=e.val,(n=o,n.split(".").map(function(t){return t.split(/\[(.*?)\]/).filter(function(t){return t})}).reduce(function(t,e){return t.concat(e)},[])).reduce(function(t,e,n,r){if(n!==r.length-1)return t[e]||(t[e]=/\d/.test(e)?[]:{}),t[e];t[e]=a},r)),Promise.resolve().then(function(){D&&(s.setData(D),Object.keys(D).filter(function(t){return v(p[t])}).forEach(function(t){var e=p[t],n=D[t],r=S[t];e.call(s,n,r)}),S=D=null)})}),r=V(n);e=r((t=this).data),t.$data=e,O(e,t),a=this,i=y,u=n,c=Object.create(null),Object.keys(i).forEach(function(t){var e=new _,n=i[t].bind(a),r=n(),o=!0;Object.defineProperty(c,t,w({},h,{get:function(){return _.targetCb&&e.addSub(_.targetCb),o?(_.targetCb=function(){u({path:t,newVal:n(),oldVal:r}),e.notify()},r=n(),_.targetCb=null,o=!1,r):r=n()},set:function(){console.warn("[TUA-MP]: 请勿对 computed 属性 "+t+" 赋值，它应该由 data 中的依赖自动计算得到！")}}))}),a.$computed=c,O(c,a),a.setData(c);for(var o=arguments.length,f=Array(o),l=0;l<o;l++)f[l]=arguments[l];d.onLoad&&d.onLoad.apply(this,f)}}))},Object.defineProperty(t,"__esModule",{value:!0})});

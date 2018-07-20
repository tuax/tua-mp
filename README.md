<h1 align="center">tua-mp</h1>

<h5 align="center">
    让我们一步步地陷入用 Vue 写小程序的深渊...
</h5>

<p align="center">
    <a href="https://github.com/feross/standard"><img src="./docs/.vuepress/public/standard.svg" alt="Standard - JavaScript Style"></a>
</p>

<p align="center">
    <a href="https://circleci.com/gh/tuateam/tua-mp/tree/master"><img src="https://img.shields.io/circleci/project/tuateam/tua-mp/master.svg" alt="Build Status"></a>
    <a href="https://codecov.io/github/tuateam/tua-mp?branch=master"><img src="https://img.shields.io/codecov/c/github/tuateam/tua-mp/master.svg" alt="Coverage Status"></a>
    <a href="https://www.npmjs.com/package/tua-mp"><img src="https://img.shields.io/npm/v/tua-mp.svg" alt="Version"></a>
    <a href="https://www.npmjs.com/package/tua-mp"><img src="https://img.shields.io/npm/l/tua-mp.svg" alt="License"></a>
    <img src="https://img.shields.io/badge/dependencies-none-green.svg" alt="dependencies">
</p>

## 0.介绍
`tua-mp` 是一个用于开发微信小程序的**渐进式框架**，它与其他小程序框架不同的是，`tua-mp` 可以由浅入深地用于你的小程序项目。

<p align="center">
    <a href="https://tuateam.github.io/tua-mp/">👉完整文档地址点这里👈</a>
</p>

## 1.安装
## 1.1.最基础的使用方式 -- [examples/basic/](https://github.com/tuateam/tua-mp/tree/master/examples/basic)
下载 [https://github.com/tuateam/tua-mp/blob/master/examples/basic/utils/tua-mp.js](https://github.com/tuateam/tua-mp/blob/master/examples/basic/utils/tua-mp.js) 文件到你的小程序项目中，例如保存为 `utils/tua-mp.js`。

代码片段地址为：**wechatide://minicode/JzXSn8mb78n8**

> 可以尝试复制以上片段地址到浏览器地址栏中打开

[如果依然打不开，可以手动打开开发者工具导入代码片段查看](https://developers.weixin.qq.com/miniprogram/dev/devtools/minicode.html)

接着在入口的 `js` 代码中：

* 在页面中使用 `TuaPage` 替代小程序提供的 `Page`
* 在组件中使用 `TuaComp` 替代小程序提供的 `Component`

替换后即可使用开发 `Vue` 的方式来开发小程序。

```js {5}
// pages/index/index.js
import { TuaPage } from '../../utils/tua-mp'

// Page -> TuaPage
TuaPage({ ... })
```

```js {5}
// comps/foobar/foobar.js
import { TuaComp } from '../../utils/tua-mp'

// Component -> TuaComp
TuaComp({ ... })
```

采用这种侵入性最小的方式，可以用于改写优化已有的小程序项目，即在部分页面中使用 `tua-mp`。

## 1.2.借助构建工具
在这部分我们将使用 webpack 来打包我们的源码，但其中 webpack 繁琐的配置已预先封装在 [@tua-mp/service](https://github.com/tuateam/tua-mp-service) 里了。

因此很自然地，日常前端开发中的各位“老朋友们”又回来了~

* npm
* babel
* eslint
* less/scss/stylus
* ...

### 1.支持预处理器的 simple 版本
![webpack version](https://img.shields.io/badge/webpack-%5E4.8.1-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 一键生成项目：

```bash
$ vue init tua-mp-templates/simple my-project
```

* 开发时运行 `npm start`，`webpack` 就会开启监听
* 发布时运行 `npm run build`，`webpack` 会先删除 `dist/` 然后将源码压缩生成到其中

在这个例子中我们将源码放在了 `src/` 下，利用 `webpack` 将其打包生成到 `dist/` 目录下。

此外还对于样式的编写加入了预处理器的功能

* wxss: 会被拷贝到 dist/ 下的对应路径
* css: 需要在 js 中引入，生成对应的 wxss
* less: 需要在 js 中引入，生成对应的 wxss
* scss/sass: 需要在 js 中引入，生成对应的 wxss
* stylus: 需要在 js 中引入，生成对应的 wxss

### 2.支持单文件组件的 vue 版本
![webpack version](https://img.shields.io/badge/webpack-%5E4.8.1-green.svg)
![vue-loader version](https://img.shields.io/badge/vue--loader-%5E15.0.12-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 一键生成项目：

```bash
$ vue init tua-mp-templates/vue my-project
```

在这个例子中我们添加了 `vue-loader`，让我们能够使用文件扩展名为 `.vue` 的 `single-file components`(单文件组件) 。

[单文件组件就是将模板（template）、脚本（script）、样式（style）写在一个文件中。](https://cn.vuejs.org/v2/guide/single-file-components.html)

但在这个例子中的单文件组件和一般 web 端的单文件组件**有所不同**：

1.页面的模板需要添加 `lang="wxml"`

```vue {1}
<template lang="wxml">
    <!-- 小程序模板代码 -->
</template>
```

2.原本的 `.json` 文件变成了 `<config>`

```vue {2,13}
<!-- 默认 json -->
<config>
{
    "navigationBarTitleText": "tua-mp todos",
    "usingComponents": {
        "Todo": "./comps/Todo/Todo",
        "Filter": "/comps/Filter/Filter"
    }
}
</config>

<!-- yaml 也支持 -->
<config lang="yaml">
navigationBarTitleText: 'tua-mp todos'
usingComponents:
    Todo: ./comps/Todo/Todo
    Filter: /comps/Filter/Filter
</config>
```

> [什么是自定义块？](https://vue-loader.vuejs.org/zh/guide/custom-blocks.html)

<image src="./docs/.vuepress/public/logs.vue.png" width="400" alt="logs.vue" />

**以上两个例子中的 `/pages/todos/todos` 页面都实现了 todos 应用。**

<image src="./docs/.vuepress/public/tua-mp-todos.gif" width="400" alt="tua-mp-todos" />

## 2.使用说明
使用方式上和 Vue 对齐，[对 Vue 还不熟悉？](https://cn.vuejs.org/v2/guide/)

* 实现相同的组件配置（data、computed、methods、watch）
* 实现赋值改变数据和界面，而不是调用小程序原生的 `this.setData`
* 实现 `computed` 功能
* 实现完整 `watch` 功能
* 实现异步 `setData` 功能，即假如在一个事件循环周期内多次对于同一个属性赋值，只会触发一次小程序原生的 `setData` 函数以及相关的 `watch` 函数（详见下面例子中的 `onLoad` 函数）
* 实现生命周期钩子的适配
* 实现小程序原生组件的适配
  * 可以传递 Vue 风格的 props
  * 可以使用 computed、watch
  * 并使用 $emit 封装了原生的 triggerEvent 方法

```js
import { TuaComp, TuaPage } from 'tua-mp'

// 在组件中使用 TuaComp 替代小程序提供的 Component
TuaComp({ ... })

// 使用 TuaPage 替代小程序提供的 Page
TuaPage({
    // data 可以是类似 Vue 的函数形式（推荐），也可以是类似小程序的对象形式
    // 注意：需要绑定的数据必须要先在 data 里声明！
    // 因为 ES5 的 getter/setter 方法无法感知添加新的属性
    data () {
        return {
            a: { b: 'b' },
            c: [{ d: { e: 'e' } }],
            f: 'f',
            g: 'hello world',

            // 注意：因为小程序会使用类似 /^__.*__$/
            // 这样的属性保存内部状态，例如：
            // __webviewId__、__route__、__wxWebviewId__
            // 所以这样的前后两个下划线起名的属性
            // 在初始化观察数据时会被略过，即不会生成 getter/setter
            __foo__: 'bar',
        }
    },

    // 计算属性
    computed: {
        // 注意这里是函数
        reversedG () {
            return this.g.split('').reverse().join('')
        },
        // 多个依赖也没问题
        gAndAB () {
            return this.g + ' + ' + this.a.b
        },
        // 还可以由 computed 继续派生新的数据
        dataAndComputed () {
            return this.g + ' + ' + this.reversedG
        },
    },

    // 小程序原本的生命周期方法也能使用
    // 建议不要放在 methods 里，
    // 因为就像 Vue 中的 created、mounted 等生命周期方法一样
    onLoad () {
        for (let i = 100; i > 90; i--) {
            // 只会触发一次 setData
            this.g = i
        }
    },

    // Vue 生命周期的适配
    created () {},
    mounted () {},
    beforeUpdate () {},
    updated () {},

    // 侦听器
    watch: {
        // 监听 data
        g (newVal, oldVal) {
            console.log(`g: ${oldVal} -> ${newVal}`)
            // 异步操作
            setTimeout(() => {
                this.a.b = 'new a.b from watch'
            }, 1000)
        },

        // 监听嵌套属性
        'a.b' (newVal, oldVal) {
            console.log(`a.b: ${oldVal} -> ${newVal}`)
            // 异步操作
            setTimeout(() => {
                this.msg = 'new msg from watch'
            }, 1000)
        }

        // 监听 computed
        reversedG (newVal, oldVal) {
            // ...
        },

        // 数组、deep、immediate
        a: [
            { deep: true, immediate: true, handler () {} },
            // 调用 methods 中的 aFn 方法
            'aFn',
            // 同样调用 methods 中的 aFn 方法
            { immediate: true, handler: 'aFn' }
        ],
    },

    // 方法建议都挂在 methods 下
    methods: {
        aFn () {},
        onTap () {
            // 类似 Vue 的操作方式
            this.f = 'onTap'
            this.a.b = 'onTap'
            this.c[0].d.e = 'onTap'

            // 劫持了数组的以下方法: pop, push, sort, shift, splice, unshift, reverse
            this.c.push('onTap')

            // 对于不改变原数组的以下方法: map, filter, concat, slice...
            // 建议采取直接替换原数组的方式
            this.c = this.c.map(x => x + 1)

            // 注意：请在 data 中先声明 x！否则无法响应 x 的变化...
            this.x = 'x'
        },
    },
})
```

## 3.文档
框架开发过程中的坑和心得记录：

* [1.终极蛇皮上帝视角之微信小程序之告别 setData](https://github.com/BuptStEve/blog/issues/12)
* [2.终极蛇皮上帝视角之微信小程序之告别“刀耕火种”](https://github.com/BuptStEve/blog/issues/13)
* [3.微信小程序之如何使用自定义组件封装原生 image 组件](https://github.com/BuptStEve/blog/issues/14)

## TODO
详见 [issues](https://github.com/tuateam/tua-mp/issues)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, StEve Young

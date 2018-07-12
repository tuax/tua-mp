<h1 align="center">tua-mp</h1>

<h5 align="center">
    让我们一步步地陷入用 Vue 写小程序的深渊...
</h5>

<p align="center">
    <a href="https://github.com/feross/standard"><img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" alt="Standard - JavaScript Style"></a>
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

## 1.安装
## 1.1.最基础的使用方式 -- [examples/basic/](https://github.com/tuateam/tua-mp/tree/master/examples/basic)
下载 [https://github.com/tuateam/tua-mp/blob/master/examples/basic/utils/tua-mp.js](https://github.com/tuateam/tua-mp/blob/master/examples/basic/utils/tua-mp.js) 文件到你的小程序项目中，例如保存为 `utils/tua-mp.js`。

代码片段地址为：**wechatide://minicode/bGXx7tmO6iZx**

> 可以尝试复制以上片段地址到浏览器地址栏中打开

<image src="./imgs/open-by-tab.png" width="400" alt="open-by-tab" />

[如果依然打不开，可以手动打开开发者工具导入代码片段查看](https://developers.weixin.qq.com/miniprogram/dev/devtools/minicode.html)

在页面入口的 js 代码中使用 TuaPage 替代小程序提供的 Page。

```js
// pages/index/index.js
import { TuaPage } from '../../utils/tua-mp'

// 用 TuaPage 替代 Page
TuaPage({ ... })
```

采用这种侵入性最小的方式，可以用于改写优化已有的小程序项目，即在部分页面中使用 `tua-mp`。

## 1.2.利用 webpack 打包源码
使用 `npm` 下载 `tua-mp`，然后直接 `import`。

```bash
$ npm i -S tua-mp

$ tnpm i -S @tencent/tua-mp

$ yarn add tua-mp
```

### 1.支持预处理器 -- [examples/webpack-simple/](https://github.com/tuateam/tua-mp/tree/master/examples/webpack-simple)

![webpack version](https://img.shields.io/badge/webpack-%5E4.8.1-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 一键生成项目：

```bash
$ vue init tua-mp-templates/simple my-project
```

添加相关 `loader` 处理后，通过 `extract-text-webpack-plugin` 生成 `.wxss` 文件。

* js: 经过 babel 编译成 ES5
* wxss: 会被拷贝到 dist/ 下的对应路径
* css: 需要在 js 中引入，生成对应的 wxss
* less: 需要在 js 中引入，生成对应的 wxss
* scss/sass: 需要在 js 中引入，生成对应的 wxss
* stylus: 需要在 js 中引入，生成对应的 wxss

代码片段地址为：**[wechatide://minicode/kwBhRTm26YZL](wechatide://minicode/kwBhRTm26YZL)**

### 2.利用 vue-loader 支持单文件组件 -- [examples/webpack-vue/](https://github.com/tuateam/tua-mp/tree/master/examples/webpack-vue)

![webpack version](https://img.shields.io/badge/webpack-%5E4.8.1-green.svg)
![vue-loader version](https://img.shields.io/badge/vue--loader-%5E15.0.12-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 一键生成项目：

```bash
$ vue init tua-mp-templates/vue my-project
```

在这个例子中我们添加了 `vue-loader`，让我们能够使用文件扩展名为 `.vue` 的 `single-file components`(单文件组件) 。

[单文件组件就是将模板（template）、脚本（script）、样式（style）写在一个文件中。](https://cn.vuejs.org/v2/guide/single-file-components.html)

在这个例子中的单文件组件和一般 web 端的单文件组件有所不同：

1.页面的模板我们使用的是 `<template lang="wxml">...</template>`

2.添加了一个 `<config>` 的自定义块，用于填写**页面**的配置（即原来的 `.json`）

3.由于 webpack 或其他地方需要读取 `app.json` 中的某些字段，所以在不编写 loader 的情况下只好维持原状，不将其放到 `app.vue` 中的 `<config>` 中。

> [什么是自定义块？](https://vue-loader.vuejs.org/zh/guide/custom-blocks.html)

<image src="./imgs/logs.vue.png" width="400" alt="logs.vue" />

代码片段地址为：**[wechatide://minicode/kGBfYTmQ6OZa](wechatide://minicode/kGBfYTmQ6OZa)**

**以上两个例子中的 `/pages/todos/todos` 页面都实现了 todos 应用。**

<image src="./imgs/tua-mp-todos.gif" width="400" alt="tua-mp-todos" />

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

# [tua-mp-example-webpack-vue](https://github.com/tuateam/tua-mp/tree/master/examples/webpack-vue)

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

<image src="../../imgs/logs.vue.png" width="400" alt="logs.vue" />

其中 `/pages/todos/todos` 页面实现了 todos 应用。

<image src="../../imgs/tua-mp-todos.gif" width="400" alt="tua-mp-todos" />

## 如何使用
* 开发时运行 `npm start`，`webpack` 就会开启监听
* 发布时运行 `npm run build`，`webpack` 会先删除 `dist/` 然后将源码压缩生成到其中

此外还配置了 `babel` 和 `eslint`，使用时可以根据喜好自行更改配置。

`dist/` 目录的代码片段地址为：**wechatide://minicode/kGBfYTmQ6OZa**

> 可以尝试复制以上片段地址到浏览器地址栏中打开

<image src="../../imgs/open-by-tab.png" width="400" alt="open-by-tab" />

[如果依然打不开，可以手动打开开发者工具导入代码片段查看，如下图所示：](https://developers.weixin.qq.com/miniprogram/dev/devtools/minicode.html)

<image src="../../imgs/minicode.png" width="400" alt="minicode" />

## 文件结构

* index.wxml/index.less/index.json -> Index.vue
* logs.wxml/logs.scss/logs.json -> Logs.vue

```
.
├── README.md
├── dist
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── assets
│   │   └── vue-logo.png
│   ├── chunks
│   │   ├── runtime.js
│   │   ├── scripts.js
│   │   └── vendors.js
│   ├── comps
│   │   └── Filter
│   │       ├── Filter.js
│   │       ├── Filter.json
│   │       ├── Filter.wxml
│   │       └── Filter.wxss
│   ├── pages
│   │   ├── index
│   │   │   ├── comps
│   │   │   │   └── TestComp
│   │   │   │       ├── TestComp.js
│   │   │   │       ├── TestComp.json
│   │   │   │       ├── TestComp.wxml
│   │   │   │       └── TestComp.wxss
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   ├── logs
│   │   │   ├── logs.js
│   │   │   ├── logs.json
│   │   │   ├── logs.wxml
│   │   │   └── logs.wxss
│   │   └── todos
│   │       ├── comps
│   │       │   └── Todo
│   │       │       ├── Todo.js
│   │       │       ├── Todo.json
│   │       │       ├── Todo.wxml
│   │       │       └── Todo.wxss
│   │       ├── todos.js
│   │       ├── todos.json
│   │       ├── todos.wxml
│   │       └── todos.wxss
│   ├── project.config.json
│   └── templates
│       └── info.wxml
├── package.json
├── project.config.json
├── src
│   ├── app
│   │   ├── App.vue
│   │   ├── app.json
│   │   └── index.js
│   ├── assets
│   │   └── vue-logo.png
│   ├── comps
│   │   └── Filter
│   │       ├── Filter.vue
│   │       └── index.js
│   ├── pages
│   │   ├── index
│   │   │   ├── Index.vue
│   │   │   ├── comps
│   │   │   │   └── TestComp
│   │   │   │       ├── TestComp.vue
│   │   │   │       └── index.js
│   │   │   └── index.js
│   │   ├── logs
│   │   │   ├── Logs.vue
│   │   │   └── index.js
│   │   └── todos
│   │       ├── Todos.vue
│   │       ├── comps
│   │       │   └── Todo
│   │       │       ├── Todo.vue
│   │       │       └── index.js
│   │       └── index.js
│   ├── scripts
│   │   ├── const
│   │   │   ├── README.md
│   │   │   └── index.js
│   │   └── utils
│   │       ├── README.md
│   │       ├── event.js
│   │       ├── format.js
│   │       ├── index.js
│   │       └── log.js
│   ├── styles
│   │   ├── global.styl
│   │   ├── todomvc-app-css.css
│   │   └── todomvc-common-base.css
│   └── templates
│       └── info.wxml
├── webpack.config.babel.js
├── webpackUtils.js
└── yarn.lock
```

### `src/` 源码
* app/: 应用入口
* assets/: 资源文件，比如图片
* comps/: 组件
* pages/: 页面
    * pages/index/comps/: 属于 index 的页面级组件
    * pages/todos/comps/: 属于 todos 的页面级组件
* scripts: 公用代码
* scripts/const: 常量（已配置别名 @const）
* scripts/utils: 辅助函数（已配置别名 @utils）
* styles/: 公用样式
* templates/: 模板

### `dist/` 打包后代码
* chunks/: 公共依赖
    * runtime: [是 webapck 在运行时连接各个模块的代码](https://doc.webpack-china.org/concepts/manifest/#runtime)
    * vendors: 是提取的 `node_modules` 下的依赖
    * scripts: 是提取的 `src/scripts/` 下的依赖
* comps/: 组件
* pages/: 页面
    * pages/index/comps/: 属于 index 的页面级组件
    * pages/todos/comps/: 属于 todos 的页面级组件

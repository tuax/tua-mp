# [tua-mp-example-webpack-two](https://github.com/tuateam/tua-mp/tree/master/examples/webpack-two)

![webpack version](https://img.shields.io/badge/webpack-%5E4.8.1-green.svg)

在这个例子中我们将源码放在了 `src/` 下，利用 `webpack` 将其打包生成到 `dist/` 目录下。

此外还对于样式的编写加入了预处理器的功能

* wxss: 会被拷贝到 dist/ 下的对应路径
* css: 需要在 js 中引入，生成对应的 wxss
* less: 需要在 js 中引入，生成对应的 wxss
* scss/sass: 需要在 js 中引入，生成对应的 wxss
* stylus: 需要在 js 中引入，生成对应的 wxss

其中 `/pages/todos/todos` 页面实现了 todos 应用。

<image src="../../doc/imgs/tua-mp-todos.gif" width="400" alt="tua-mp-todos" />

## 如何使用
* 开发时运行 `npm start`，`webpack` 就会开启监听
* 发布时运行 `npm run build`，`webpack` 会先删除 `dist/` 然后将源码压缩生成到其中

此外还配置了 `babel` 和 `eslint`，使用时可以根据喜好自行更改配置。

`dist/` 目录代码片段地址为：**wechatide://minicode/aBYKvtmM6EZJ**

> 可以尝试复制以上片段地址到浏览器地址栏中打开

<image src="../../doc/imgs/open-by-tab.png" width="400" alt="open-by-tab" />

[如果依然打不开，可以手动打开开发者工具导入代码片段查看，如下图所示：](https://developers.weixin.qq.com/miniprogram/dev/devtools/minicode.html)

<image src="../../doc/imgs/minicode.png" width="400" alt="minicode" />

## 文件结构

```
.
├── README.md
├── dist
├── package.json
├── src
│   ├── app
│   │   ├── app.js
│   │   ├── app.json
│   │   └── app.scss
│   ├── assets
│   │   └── vue-logo.png
│   ├── pages
│   │   ├── index
│   │   │   ├── index.js
│   │   │   ├── index.less
│   │   │   └── index.wxml
│   │   └── logs
│   │       ├── logs.js
│   │       ├── logs.json
│   │       ├── logs.scss
│   │       └── logs.wxml
│   ├── scripts
│   │   ├── const
│   │   │   └── README.md
│   │   └── utils
│   │       ├── README.md
│   │       ├── format.js
│   │       ├── index.js
│   │       └── log.js
│   └── styles
│       └── global.styl
├── webpack.config.babel.js
└── yarn.lock
```

* src/: 源码
* src/app: 应用入口
* src/scripts: 公用代码
* src/scripts/const: 常量（已配置别名 @const）
* src/scripts/utils: 常量（已配置别名 @utils）
* src/styles: 公用样式
* dist/: 打包后代码
* dist/chunks/: 公共依赖
    * runtime: [是 webapck 在运行时连接各个模块的代码](https://doc.webpack-china.org/concepts/manifest/#runtime)
    * vendors: 是提取的 `node_modules` 下的依赖
    * scripts: 是提取的 `src/scripts/` 下的依赖
* assets/: 资源文件，比如图片

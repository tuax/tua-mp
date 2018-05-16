# tua-mp-example-webpack-one

![webpack version](https://img.shields.io/badge/webpack-%5E4.8.1-green.svg)

在这个例子中我们将源码放在了 `src/` 下，利用 `webpack` 将其打包生成到 `dist/` 目录下。

注意我们只会对于 js 文件进行处理，**但对于 `wxml/wxss/json` 文件不进行处理，只是简单拷贝。**

## 如何使用
* 开发时运行 `npm start`，`webpack` 就会开启监听
* 发布时运行 `npm run build`，`webpack` 会先删除 `dist/` 然后将源码压缩生成到其中

此外还配置了 `babel` 和 `eslint`，使用时可以根据喜好自行更改配置。

## 文件结构

```
.
├── README.md
├── dist
│   ├── app.js
│   ├── app.js.map
│   ├── app.json
│   ├── app.wxss
│   ├── assets
│   │   └── vue-logo.png
│   ├── chunks
│   │   ├── runtime.js
│   │   ├── runtime.js.map
│   │   ├── utils.js
│   │   ├── utils.js.map
│   │   ├── vendors.js
│   │   └── vendors.js.map
│   └── pages
│       ├── index
│       │   ├── index.js
│       │   ├── index.js.map
│       │   ├── index.wxml
│       │   └── index.wxss
│       └── logs
│           ├── logs.js
│           ├── logs.js.map
│           ├── logs.json
│           ├── logs.wxml
│           └── logs.wxss
├── package.json
├── src
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── assets
│   │   └── vue-logo.png
│   ├── pages
│   │   ├── index
│   │   │   ├── index.js
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   └── logs
│   │       ├── logs.js
│   │       ├── logs.json
│   │       ├── logs.wxml
│   │       └── logs.wxss
│   └── utils
│       └── index.js
├── webpack.config.babel.js
└── yarn.lock
```

* src/: 源码
* dist/: 打包后代码
* dist/chunks/: 公共依赖
    * runtime: [是 webapck 在运行时连接各个模块的代码](https://doc.webpack-china.org/concepts/manifest/#runtime)
    * vendors: 是提取的 `node_modules` 下的依赖
    * utils: 是提取的 `src/utils/` 下的依赖
* assets/: 资源文件，比如图片

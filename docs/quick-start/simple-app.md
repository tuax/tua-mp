# 过渡版本
## 一键生成项目
![webpack version](https://img.shields.io/badge/webpack-%5E4.8.1-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 一键生成项目：

```bash
$ vue init tua-mp-templates/simple my-project
```

接下来让咱们一步步地将原项目代码迁移到过渡版本中。

> 之所以叫【过渡版本】，是因为在这个版本中仅仅增加了 babel 支持、npm 支持、预编译器支持等等。每个页面和组件仍然是由4个文件组成。（`.json`、`.wxml`、`.js`、`.wxss/.css/.less/.sass/.scss/.styl`）

::: tip
如果你是 Vue 重度用户，建议直接看下一章[《单文件组件版本》](./vue-app.md)，下一章中我们将借助 vue-loader v15+ 实现单文件组件即 `.vue` 文件的支持。
:::

## 文件结构
### 根目录
文件结构和一般的 web 项目差不多：

```
.
├── README.md
├── dist/
├── package.json
├── tua-mp.config.js
├── project.config.json
└── src/
```

* src/: 源码
* dist/: 打包后代码
* tua-mp.config.js: `@tua-mp/service` 的配置文件
* project.config.json: 小程序开发工具配置文件，会被拷到 `dist/` 下

### src/ 目录
```
.
├── app
│   ├── app.js
│   ├── app.json
│   └── app.scss
├── assets
│   └── vue-logo.png
├── comps
│   └── todo
│       ├── todo.js
│       ├── todo.json
│       ├── todo.less
│       └── todo.wxml
├── pages
│   └── index
│       ├── index.js
│       ├── index.json
│       ├── index.less
│       └── index.wxml
├── scripts
│   ├── const
│   │   ├── README.md
│   │   └── index.js
│   └── utils
│       ├── README.md
│       ├── event.js
│       ├── format.js
│       ├── index.js
│       └── log.js
├── styles
│   ├── global.styl
│   ├── todomvc-app-css.css
│   └── todomvc-common-base.css
└── templates
    └── info.wxml
```

* app/: 应用入口
* assets/: 资源文件，比如图片
* comps/: 组件
* pages/: 页面
* scripts: 公用代码
* scripts/const: 常量（已配置别名 @const）
* scripts/utils: 辅助函数（已配置别名 @utils）
* styles/: 公用样式
* templates/: 模板

## tua-mp.config.js
以上那些特性的支持是因为底层调用了 webpack 将源代码转换成小程序的代码。由于 webpack 配置太繁琐了，因此受到 [@vue/cli-service](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service) 的启发，这部分配置也用 [@tua-mp/service](https://github.com/tuateam/tua-mp-service) 进行了封装。

这个配置文件提供了一个入口让开发者可以对于 webpack 进行二次配置。

```js
// tua-mp.config.js
module.exports = {
    // 简单配置
    // 这部分的配置最终会通过 webpack-merge 和已有的 webpack 配置合并。
    configureWebpack: {
        plugins: [
            new MyAwesomeWebpackPlugin()
        ],
    },
    // 链式配置
    // 这个函数会传入一个 webpack-chain 对象，这样你就可以更加细粒度地对内部配置进行任意自定义修改。
    chainWebpack: (config) => {
        // app 应用入口
        config.entry('app')
            // 因为默认入口是 ./src/app/index.js
            .clear()
            .add('./src/app/app').end()
    },
}
```

> 更多用法可参阅 [@tua-mp/service](../tua-mp-service/)

## 开发与发布
安装了 `@tua-mp/service` 之后，会在你的项目中的 `node_modules/.bin/` 下安装脚本 `tua-mp-service`，所以你可以使用 `npm scripts` 或直接在命令行中调用 `./node_modules/.bin/tua-mp-service`。

例如在 package.json 中添加以下内容：

* `serve` 即 `webpack --mode=development -w`
* `build` 即 `webpack --mode=production`

```json
{
    "scripts": {
        "start": "tua-mp-service serve",
        "build": "tua-mp-service build"
    }
}
```

然后就可以这样调用：

```bash
# 开发
npm start
# OR
yarn start

# 打包
npm run build
# OR
yarn build
```

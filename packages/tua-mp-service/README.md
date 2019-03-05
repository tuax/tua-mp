<h1 align="center">@tua-mp/service</h1>

> inspired by [@vue/cli-service](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service)

<p align="center">
    <a href="https://www.npmjs.com/package/@tua-mp/service"><img src="https://img.shields.io/npm/v/@tua-mp/service.svg" alt="Version"></a>
    <a href="https://www.npmjs.com/package/@tua-mp/service"><img src="https://img.shields.io/npm/l/@tua-mp/service.svg" alt="License"></a>
</p>

## 0.介绍
这个包封装了 webpack 配置，这样业务代码就可以和构建工具隔离，方便单独升级构建工具。

默认内置了 yaml/css/less/scss/stylus 的支持。

```html
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

<!-- yaml 或者 yml 也支持 -->
<config lang="yml">
navigationBarTitleText: 'tua-mp todos'
usingComponents:
    Todo: ./comps/Todo/Todo
    Filter: /comps/Filter/Filter
</config>

<!-- 默认 css -->
<style></style>

<!-- less -->
<style lang="less"></style>

<!-- scss -->
<style lang="scss"></style>

<!-- stylus -->
<style lang="stylus"></style>
```

## 1.安装

```bash
$ npm i -D @tua-mp/service
# OR
$ yarn add -D @tua-mp/service
```

## 2.基本使用
安装之后，会在你的项目中的 `node_modules/.bin/` 下安装脚本 `tua-mp-service`，所以你可以使用 `npm scripts` 或直接在命令行中调用 `./node_modules/.bin/tua-mp-service`。

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

## 3.进阶使用
除了基础的使用方法，还可以在项目中新建文件 `tua-mp.config.js` 进行一些自定义配置。

### 3.1.简单配置
最简单的配置方式就是在 `tua-mp.config.js` 中添加一个对象形式的 `configureWebpack` 选项。

```js
// tua-mp.config.js
module.exports = {
    configureWebpack: {
        plugins: [
            new MyAwesomeWebpackPlugin()
        ],
    },
}
```

这部分的配置最终会通过 [webpack-merge](https://github.com/survivejs/webpack-merge) 和已有的 webpack 配置合并。

### 3.2.延迟配置
假如你想根据当前的环境变量来动态地配置，那么可以传入一个函数，这个函数会将最终配置传入，这样你就可以**直接修改配置**，或者**返回一个对象合并**（同上）。

```js
// tua-mp.config.js
module.exports = {
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // mutate config for production...
        } else {
            // mutate for development...
        }
    },
}
```

### 3.3.链式配置(进阶用法)
首先在 `tua-mp.config.js` 中添加一个函数形式的 `chainWebpack` 选项。

这个函数会传入一个 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 对象，这样你就可以更加**细粒度**地对内部配置进行任意自定义修改。

```js
// tua-mp.config.js
module.exports = {
    chainWebpack: (config) => {
        config.module
            .rule('vue')
            .use('vue-loader')
                .loader('vue-loader')
                .tap((options) => {
                    // modify the options...
                    return options
                })
    },
}
```

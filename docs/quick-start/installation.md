# 安装
## 1.下载源码
首先 [点我下载源码](https://raw.githubusercontent.com/tuateam/tua-mp/master/packages/tua-mp/examples/basic/utils/tua-mp.js)，保存到你的小程序中（假设保存在 `utils/tua-mp.js`）。

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

::: tip
采用这种侵入性最小的方式，可以用于重构已有的小程序项目。即在部分页面或组件中使用 `tua-mp`。
:::

## 2.借助构建工具
在这部分我们将使用 webpack 来打包我们的源码，但其中 webpack 繁琐的配置已预先封装在 [@tua-mp/service](../tua-mp-service/) 里了。

因此很自然地，日常前端开发中的各位“老朋友们”又回来了~

* npm
* babel
* eslint
* less/scss/stylus
* ...

### 2.1.支持预处理器的 simple 版本
![webpack version](https://img.shields.io/badge/webpack-%5E4.12.1-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 或 [@tua-mp/cli](../tua-mp-cli/) 一键生成项目：

```bash
$ vue init tua-mp-templates/simple my-project
# OR
$ tuamp init tua-mp-templates/simple my-project
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

### 2.2.支持单文件组件的 vue 版本
![webpack version](https://img.shields.io/badge/webpack-%5E4.12.1-green.svg)
![vue-loader version](https://img.shields.io/badge/vue--loader-%5E15.2.4-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 或 [@tua-mp/cli](../tua-mp-cli/) 一键生成项目：

```bash
$ vue init tua-mp-templates/vue my-project
# OR
$ tuamp init tua-mp-templates/vue my-project
```

在这个例子中我们添加了 `vue-loader`，让我们能够使用文件扩展名为 `.vue` 的 `single-file components`(单文件组件) 。

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

<!-- yaml 或者 yml 也支持 -->
<config lang="yml">
navigationBarTitleText: 'tua-mp todos'
usingComponents:
    Todo: ./comps/Todo/Todo
    Filter: /comps/Filter/Filter
</config>
```

# 单文件组件版本
## 一键生成项目
![webpack version](https://img.shields.io/badge/webpack-%5E4.12.1-green.svg)
![vue-loader version](https://img.shields.io/badge/vue--loader-%5E15.2.4-green.svg)

推荐使用 [vue-cli](https://github.com/vuejs/vue-cli) 或 [@tua-mp/cli](../tua-mp-cli/) 一键生成项目：

```bash
$ vue init tua-mp-templates/vue my-project
# OR
$ tuamp init tua-mp-templates/vue my-project
```

## 文件结构
### src/ 目录

```
.
├── app
│   ├── App.vue
│   ├── app.js
│   └── app.json
├── assets
│   └── vue-logo.png
├── comps
│   ├── filter
│   │   ├── Filter.vue
│   │   └── index.js
│   └── todo
│       ├── Todo.vue
│       └── index.js
├── pages
│   ├── index
│   │   ├── Index.vue
│   │   └── index.js
│   └── todos
│       ├── Todos.vue
│       └── index.js
├── scripts
│   ├── const
│   │   ├── README.md
│   │   └── index.js
│   └── utils
│       ├── README.md
│       ├── event.js
│       ├── format.js
│       ├── index.js
│       └── log.js
├── styles
│   ├── global.styl
│   ├── todomvc-app-css.css
│   └── todomvc-common-base.css
└── templates
    └── info.wxml
```

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

## 单文件组件
注意到现在咱们的 `pages/` 和 `comps/` 下的组件已经用上了单文件组件。

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

3.`app.json` 是独立文件

注意 `app.json` 文件中的内容并没有像组件一样放到 `App.vue` 的 `<config>` 中。

理论上这部分的配置应该放在 `app.js` 的 `export` 中比较好，但因为暂时还没对于 vue-loader 进行修改，所以这部分先保持为 `app.json`。

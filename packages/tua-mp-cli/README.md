<h1 align="center">@tua-mp/cli</h1>

<p align="center">
    <a href="https://www.npmjs.com/package/@tua-mp/cli">
        <img src="https://img.shields.io/npm/v/@tua-mp/cli.svg" alt="Version">
        <img src="https://img.shields.io/npm/v/@tua-mp/cli/next.svg" alt="Next Version">
        <img src="https://img.shields.io/npm/l/@tua-mp/cli.svg" alt="License">
    </a>
</p>

## 介绍
这个包为 tua-mp 提供了一些方便的命令，可以用于一键生成项目、创建页面、创建组件、创建 api 等功能。

## 安装

```bash
$ npm i -g @tua-mp/cli
# OR
$ yarn global add @tua-mp/cli
```

## 使用
### 初始化项目 `init`
这个命令代理了 vue-cli v2，所以用法也一样...

```bash
$ tuamp init <template-name> <project-name>
```

### 添加接口命令 `add api`
这个命令将添加一个新文件 `<name>.js` 到 `src/apis/` 下，并且如果不存在 `src/apis/index.js` 则会自动创建。

```bash
# 添加小程序端 api
$ tuamp add api <name>
# OR
$ tuamp a api <name>
```

该命令会自动在 `src/apis/index.js` 中导出该 `api`，例如 `<name>` 为 `foo-bar`，那么导出的接口名称为 `fooBarApi`（已转成小驼峰，并在结尾加上 `Api`）。

### 添加页面命令 `add page`
这个命令将添加一个新文件夹 `<name>` 到 `src/pages/` 下，并且自动添加 `pages/<name>/<name>` 到 `src/app/app.json` 中。

并且如果页面以**连字符**命名，那么相关的 `.vue` 文件会被转成**大驼峰**风格。

```
└─ pages
   ├─ ...
   └─ a-b           // 连字符
      ├─ AB.vue     // 大驼峰
      └─ index.js
```

```bash
# 添加小程序端 page
$ tuamp add page <name>
# OR
$ tuamp a page <name>
```

该命令会自动读取 `src/app/app.json` 中的 `pages` 字段，并将新页面加入。

### 添加页面命令 `add comp`
由于组件一般分为两种：

* 全局组件（位于 `src/comps/` 下）
* 页面组件（位于 `src/pages/foo-bar/comps/` 下）

所以这个命令有两种用法，添加可选的 `-g, --global` 参数表示添加全局组件，将添加一个新文件夹 `<name>` 到 `src/comps/` 下，否则会进行交互式询问模板文件夹的路径。

组件建议都使用**大驼峰**命名风格

```
└─ comps
   ├─ ...
   └─ TuaImage          // 大驼峰
      ├─ TuaImage.vue   // 大驼峰
      └─ index.js
```

* 全局添加小程序端 comp(-g, --global)

```bash
$ tuamp add comp <name> --global
# OR
$ tuamp a comp <name> -g
```

* 局部添加小程序端 comp

```bash
$ tuamp add comp <name>
# OR
$ tuamp a comp <name>
```

> 注意使用 `<Tab>` 键补全路径，输入不存在的文件夹时会自动创建。

### 导出模板命令 `eject` <Badge text="0.3.0+"/>
这个命令将包中的默认模板导出到 `.templates/` 中。

这样通过修改`.templates/` 下的模板文件，即可实现自定义模板功能。

```bash
$ tuamp eject
# OR
$ tuamp e
```

## 配置
配置文件和 `@tua-mp/service` 一样，都是使用 `tua.config.js`。

### templateDir <Badge text="0.3.0+"/>
* 类型：`String`
* 默认值：`.templates`

自定义模板的路径。

**读取模板的优先级逻辑是：**

1. 首先尝试使用 `tua.config.js` 中的 `templateDir` 字段
2. 接着尝试读取 `.templates/`
3. 最后读取默认模板

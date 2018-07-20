# 介绍
## tua-mp 是什么
`tua-mp` 是一款类 Vue 的**渐进式**微信小程序框架，它与其他小程序框架不同的是，`tua-mp` 可以由浅入深地用于你的小程序项目。

## 起步
::: tip
官方指南假设你已了解关于 [微信小程序开发](https://developers.weixin.qq.com/miniprogram/dev/index.html) 和 [Vue.js](https://cn.vuejs.org/v2/guide/index.html) 的基础知识。
:::

尝试 `tua-mp` 最简单的方法是 [👉点击这里打开代码片段👈](wechatide://minicode/JzXSn8mb78n8)，这个操作会打开你的**微信开发者工具**，并导入代码片段。（详情可参阅 [代码片段文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/minicode.html)）

如果还没有安装 【微信开发者工具】 [👉点击这里下载👈](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

[安装教程](./installation.md) 给出了更多安装 `tua-mp` 的方式：

* [下载源码](./installation.md#_1-下载源码)
* [借助构建工具](./installation.md#_2-借助构建工具)
    * [支持预处理器的 simple 版本](./installation.md#_2-1-支持预处理器的-simple-版本)
    * [支持单文件组件的 vue 版本](./installation.md#_2-借助构建工具)

## 声明式渲染
在使用 `tua-mp` 时，暂时还是使用小程序原生的模板。

```html
<!-- 注意编写的是 wxml 模板 -->
<view>{{ msg }}</view>
```

```js
TuaPage({
    data: { msg: 'steve' },
    created () {
        // 将当前页面实例挂到全局变量中方便测试
        global = this
    },
})
```

我们已经成功创建了第一个 `tua-mp` 应用！看起来这跟渲染一个字符串模板非常类似，但是 `tua-mp` 在背后做了一点微小的工作。

现在改变数据已经不需要调用 `setData`，所有数据都是响应式的。我们要怎么确认呢？[👉点击这里打开代码片段👈](wechatide://minicode/JzXSn8mb78n8)，在控制台里修改 `global.msg` 的值，你将看到上例相应地更新。

```js
// 在开发者工具的控制台中
global.msg = 'young'
```

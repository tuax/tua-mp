# 实例
## tua-mp 实例类型
小程序提供了以下三个函数：

* App: 注册程序
* Page: 注册页面
* Component: 注册组件

而 `tua-mp` 只针对了 Page 和 Component 做适配，即：

* Page -> TuaPage
* Component -> TuaComp

## 创建实例
TuaPage 实例就像是没有 props 的 Vue 根实例。

```js
TuaPage({
    // 选项
})
```

TuaComp 更像是一个 Vue 实例。

```js
TuaComp({
    // 选项
})
```

## 实例生命周期钩子
由于小程序有一套自己的生命周期方法，所以 `tua-mp` 在这里进行了一些简单的兼容。

例如在触发小程序的 onLoad 方法时，如果有以下方法的话，`tua-mp` 会首先调用 beforeCreate 方法，然后调用你填写的 onLoad 方法，最后再调用 created 方法。

### Page
* onLoad: beforeCreate -> onLoad -> created
* onReady: beforeMount -> onReady -> mounted
* onShow: 无
* onHide: 无
* onUnload: beforeDestroy -> onUnload -> destroyed

### Component
* created: beforeCreate -> created
* attached: beforeMount -> attached
* ready: ready -> mounted
* moved: 无
* detached: beforeDestroy -> detached -> destroyed

此外在 setData 前会调用 beforeUpdate 方法，在 setData 回调中会调用 updated 方法。

::: warning
不要在选项属性或回调上使用[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，比如 `created: () => console.log(this.a)`。因为箭头函数是和父级上下文绑定在一起的，this 不会是如你所预期的实例，经常导致 `Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function` 之类的错误。
:::

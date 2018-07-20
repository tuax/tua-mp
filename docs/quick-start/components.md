# 组件
`tua-mp` 的组件系统是在小程序原生自定义组件上的二次封装。

## props 适配
`tua-mp` 对于 Vue 风格的 props 进行了兼容，即开发者编写 props，框架底层会转换成原生的 properties。

```js
// 简单用法
TuaComp({
    props: ['size', 'myMessage'],
})

// 对象语法，提供校验
TuaComp({
    props: {
        // 检测类型
        height: Number,
        // 检测类型 + 其他验证
        age: {
            type: Number,
            default: 0,
            required: true, // <- 注意小程序中没有这个概念
            validator: value => value >= 0,
        },
    },
})
```

::: tip
注意小程序中没有 required 这个概念
:::

## 通过事件向父级组件发送消息
小程序原生使用的是 `triggerEvent` 这个方法来触发事件。`tua-mp` 提供了 `$emit` 方法，包装原生的 `triggerEvent` 方法。

```html
<!-- 子组件 -->
<input
    value="{{ todo.title }}"
    data-id="{{ todo.id }}"
    bindblur="onBlurTodo"
/>
```

```js
// 子组件
TuaComp({
    methods: {
        onBlurTodo (e) {
            const myEventOption = {} // 触发事件的选项

            // 直接传递事件 e 即可，底层会取出并合并常用的 detail 和 dataset 上的值
            this.$emit('onBlurTodo', e, myEventOption)
        },
    },
})
```

因为一般数据会放在事件的 `detail` 属性，或者是 `currentTarget.dataset` 中，每次手动获取十分麻烦。所以 `$emit` 方法会自动取出并合并其中的值。

```html
<!-- 父组件 -->
<Todo
    ...
    bind:onBlurTodo="onBlurTodo"
/>
```

```js
// 父组件
TuaPage({
    methods: {
        onBlurTodo (e) {
            const { id, value } = getValFromEvent(e)
            // ...
        },
    },
})
```

::: tip
如果想要传递一些没有绑定在模板中的其他数据，那么需要将其放在 `detail` 属性中， `{ detail: { yourValue: 'yourValue' } }`。（因为默认会获取 `detail` 和 `currentTarget.dataset` 中的数据）
:::

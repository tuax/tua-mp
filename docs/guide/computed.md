# 计算属性和侦听器
## 计算属性
由于小程序的数据绑定比较简单，所以经常需要开发者编写很长一串代码来实现基本功能。

```html {2,4,7,10}
<!-- 一般这么写 -->
<view style="styleOne: {{ isLarge ? 'styleOne1' : 'styleOne2' }};">
    <!-- 支持字符串运算 -->
    {{ 'msg:' + msg }}

    <!-- 不支持模板字符串 -->
    {{ `msg: ${msg};` }}

    <!-- 不支持调用方法 -->
    {{ message.split('').reverse().join('') }}
</view>
```

虽然从一方面说小程序限制了你编写复杂模板逻辑的可能，让你只能编写简单的声明式逻辑，减少了出错的可能。 但是，小程序并没有提供类似 `computed` 的途径让开发者把复杂逻辑写到 js 中...

### 基础例子
模板使用计算属性。

```html
<view style="{{ styleStr }}">
    {{ reversedMsg }}
</view>
```

模板逻辑都被放到了 js 中。

```js
TuaPage({
    data: {
        isLarge: true,
        message: 'hello world',
    },
    computed: {
        styleStr () {
            return `styleOne: ${isLarge ? 'styleOne1' : 'styleOne2'};`
        },
        // 箭头函数也支持，不过要使用参数获取 vm
        reversedMsg: vm => vm.message.split('').reverse().join(''),
    },
})
```

这里我们声明了计算属性 styleStr 和 reversedMsg 来简化模板的编写。

### 计算属性 vs 侦听属性
虽然说以上逻辑也可以放在侦听属性（watch）中，但是 computed 更像是简单的数据映射，而 watch 一般用于处理一些异步操作。

```js
// 使用 watch，代码是命令式且重复的。
TuaPage({
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar',
    },
    watch: {
        firstName (val) {
            this.fullName = val + ' ' + this.lastName
        },
        lastName (val) {
            this.fullName = this.firstName + ' ' + val
        },
    },
})
```

```js
// 使用 computed，数据流十分清晰。
TuaPage({
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
    },
    computed: {
        fullName () {
            return this.firstName + ' ' + this.lastName
        },
    },
})
```

## 侦听器
虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。

```js
TuaPage({
    watch: {
        // 一般的 watch
        a: function (val, oldVal) {
            console.log('new: %s, old: %s', val, oldVal)
        },
        // 方法名
        b: 'someMethod',
        // 深度 watcher
        c: {
            deep: true,
            handler: function (val, oldVal) { /* ... */ },
        },
        // 该回调将会在侦听开始之后被立即调用
        d: {
            immediate: true,
            handler: function (val, oldVal) { /* ... */ },
        },
        // 数组
        e: [
            function handle1 (val, oldVal) { /* ... */ },
            function handle2 (val, oldVal) { /* ... */ },
        ],
        // watch vm.e.f's value: {g: 5}
        'e.f': function (val, oldVal) { /* ... */ },
    },
})
```

::: warning
注意，不应该使用箭头函数来定义 watcher 函数 (例如 `searchQuery: newValue => this.updateAutocomplete(newValue))`。理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，`this.updateAutocomplete` 将是 undefined。
:::

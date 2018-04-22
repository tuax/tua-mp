# tua-mp
这个项目希望实现用类似写 Vue 的方式来编写小程序。

<a href="https://circleci.com/gh/tuateam/tua-mp/tree/master"><img src="https://img.shields.io/circleci/project/tuateam/tua-mp/master.svg" alt="Build Status"></a>
<a href="https://codecov.io/github/tuateam/tua-mp?branch=master"><img src="https://img.shields.io/codecov/c/github/tuateam/tua-mp/master.svg" alt="Coverage Status"></a>
<a href="https://www.npmjs.com/package/tua-mp"><img src="https://img.shields.io/npm/v/tua-mp.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/tua-mp"><img src="https://img.shields.io/npm/l/tua-mp.svg" alt="License"></a>

## 0.安装

```
$ npm i -S tua-mp

$ tnpm i -S @tencent/tua-mp

$ yarn add tua-mp
```

## 1.使用说明

* 实现相同的组件配置（data、computed、methods、watch）
* 实现直接对已绑定的数据赋值，而不是调用 `this.setData`
* 实现 `computed` 功能
* 实现 `watch` 功能
* 实现异步 `setData`，提高性能

```js
import { TuaPage } from 'tua-mp'

// 使用 TuaPage 替代小程序提供的 Page
TuaPage({
    // data 可以是类似 Vue 的函数形式（推荐），也可以是类似小程序的对象形式
    // 注意：需要绑定的数据必须要先在 data 里声明！
    // 因为 ES5 的 getter/setter 方法无法感知添加新的属性
    data () {
        return {
            a: { b: 'b' },
            c: [{ d: { e: 'e' } }],
            f: 'f',
            g: 'hello world',
        }
    },

    // 计算属性
    computed: {
        // 注意这里是函数
        reversedG () {
            return this.g.split('').reverse().join('')
        },
        // 多个依赖也没问题
        gAndAB () {
            return this.g + ' + ' + this.a.b
        },
    },

    // 方法建议都挂在 methods 下
    methods: {
        onTap () {
            // 类似 Vue 的操作方式
            this.f = 'onTap'
            this.a.b = 'onTap'
            this.c[0].d.e = 'onTap'

            // 劫持了数组的以下方法: pop, push, sort, shift, splice, unshift, reverse
            this.c.push('onTap')

            // 对于不改变原数组的以下方法: map, filter, concat, slice...
            // 建议采取直接替换原数组的方式
            this.c = this.c.map(x => x + 1)

            // 注意：请在 data 中先声明 x！否则无法响应 x 的变化...
            this.x = 'x'
        },
    },

    // 侦听器
    watch: {
        // 监听 data
        g (newVal, oldVal) {
            console.log('newVal', newVal)
            console.log('oldVal', oldVal)
            // 异步操作
            setTimeout(() => {
                this.a.b = 'new a.b from watch'
            }, 1000)
        },

        // 监听嵌套属性
        'a.b' (newVal, oldVal) {
            console.log('newVal', newVal)
            console.log('oldVal', oldVal)
            // 异步操作
            setTimeout(() => {
                this.msg = 'new msg from watch'
            }, 1000)
        }

        // 监听 computed
        reversedG (newVal, oldVal) {
            // ...
        },
    },

    // 小程序原本的生命周期方法也能使用
    onLoad () {
        for (let i = 100; i > 90; i--) {
            // 只会触发一次 setData
            this.g = i
        }
    },
})
```

## 2.文档
* [1.小程序之告别 setData](https://github.com/tuateam/tua-mp/blob/master/doc/1.%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B9%8B%E5%91%8A%E5%88%AB%20setData.md)

## TODO
* 保留字
* 收集 `computed` 的依赖，这样可以精确地对变化的 `computed` 属性 `setData`，而不是一股脑儿地将全部 `computed` 属性 `setData`

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, StEve Young
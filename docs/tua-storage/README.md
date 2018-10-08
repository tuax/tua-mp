---
sidebar: auto
---

# tua-storage
这个项目希望统一封装各个端（小程序、web 端、React-Native）中对于缓存层的使用。采用 ES6+ 语法，将全部 api 使用 Promise 包裹，并采用 jest 进行了完整的单元测试。

<a href="https://circleci.com/gh/tuateam/tua-storage/tree/master"><img src="https://img.shields.io/circleci/project/github/tuateam/tua-storage/master.svg" alt="Build Status"></a>
<a href="https://codecov.io/github/tuateam/tua-storage?branch=master"><img src="https://img.shields.io/codecov/c/github/tuateam/tua-storage/master.svg" alt="Coverage Status"></a>
<a href="https://www.npmjs.com/package/tua-storage"><img src="https://img.shields.io/npm/v/tua-storage.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/tua-storage"><img src="https://img.shields.io/npm/l/tua-storage.svg" alt="License"></a>

## 0.安装

```
$ npm i -S tua-storage

$ tnpm i -S @tencent/tua-storage

$ yarn add tua-storage
```

## 1.使用说明
目前 tua-storage 支持以下使用场景：

* web 场景：使用 localStorage 作为缓存
* 小程序场景：使用微信提供的原生方法 wx.getStorage、wx.setStorage 等
* Node.js 场景：直接使用内存作为缓存（其实就是使用 object）
* React-Native 场景：使用 AsyncStorage 作为缓存

## 2.初始化
建议在全局变量上挂载 TuaStorage 的实例

```js
import TuaStorage from 'tua-storage'

// web 环境下可以挂载到 window 作为全局变量
window.tuaStorage = window.tuaStorage || new TuaStorage({
    // 同步数据方法 Map：当缓存中没有该数据，或者该数据已过期，
    // 那么会在其中寻找对应的同步数据方法，自动地取回数据
    syncFnMap: {},

    // 缓存白名单：调用清空 storage 的 clear 方法时，会跳过其中的元素
    whiteList: [],

    // 存储引擎：
    // 可传递 wx / localStorage / AsyncStorage
    // 注意：传递对象，而非字符串
    storageEngine: null,

    // 默认超时时间：以秒为单位
    defaultExpires: 30,

    // 默认存储前缀：保存数据时会自动添加该前缀
    // 这样可以通过改变该值起到删除之前版本缓存的作用
    storageKeyPrefix: 'TUA_STORAGE_PREFIX: ',
})

// 在 Node.js 或 RN 环境中可以使用 global
global.tuaStorage = global.tuaStorage || new TuaStorage({ ... })
```

## 3.保存、读取、删除、清除
1.保存数据

```js
// 调用实例的 save 函数来保存数据
tuaStorage.save({
    key: 'item key for save',
    data: 123,

    // 过期时间，默认值为实例化时的值，以秒为单位
    expires: 10,

    // 同步数据所需参数对象，可不传
    syncParams: {},

    // 是否优先使用内存中的缓存，默认为 true
    isEnableCache: true,
})
```

2.读取数据：如果没有数据或缓存数据已过期，则会自动调用传入的 syncFn，或者在 syncFnMap 中已保存的对应于 key 的同步函数

```js
// 调用实例的 load 函数来读取数据
tuaStorage.load({
    key: 'item key for load',

    // 同步方法，可不传。
    // 会自动去 syncFnMap 寻找中已保存的对应于 key 的同步函数
    syncFn: () => { ... },

    // 过期时间，可被用于自动 save 时，默认值为实例化时的值，以秒为单位
    expires: 10,

    // 同步数据所需的参数对象，可不传
    syncParams: {},

    // 调用同步方法后是否自动保存结果，默认为 true
    isAutoSave: true,

    // 是否优先使用内存中的缓存，默认为 true
    isEnableCache: true,

    // 是否直接调用同步函数更新数据，默认为 false
    // 适用于需要强制更新数据的场景，例如小程序中的下拉刷新
    isForceUpdate: true,
})
```

3.删除数据

```js
// 调用实例的 remove 函数来删除数据
tuaStorage.remove('item key for remove')
```

4.清除数据

```js
// 调用实例的 clear 函数来清除所有数据，可传入白名单数组，删除时会跳过其中的元素
tuaStorage.clear(['item key for reserve', 'important data'])
```

## 4.批量保存、批量读取、批量删除
1.批量保存数据

```js
// 调用实例的 save 函数来批量保存数据
tuaStorage.save([
    {
        key: 'item key1 for save',
        data: 123,

        // 过期时间，默认值为实例化时的值，以秒为单位
        expires: 10,

        // 同步数据所需参数对象，可不传
        syncParams: {},

        // 是否优先使用内存中的缓存，默认为 true
        isEnableCache: true,

        // 是否直接调用同步函数更新数据，默认为 false
        // 适用于需要强制更新数据的场景，例如小程序中的下拉刷新
        isForceUpdate: true,
    },
    {
        key: 'item key2 for save',
        data: 1217,
    },
    {
        key: 'item key3 for save',
        data: 0102,
    },
])
```

2.批量读取数据

```js
// 调用实例的 load 函数来批量读取数据
tuaStorage.load([
    {
        key: 'item key1 for load',

        // 同步方法，可不传。
        // 会自动去 syncFnMap 寻找中已保存的对应于 key 的同步函数
        syncFn: () => { ... },

        // 过期时间，可被用于自动 save 时，默认值为实例化时的值，以秒为单位
        expires: 10,

        // 同步数据所需的参数对象，可不传
        syncParams: {},

        // 调用同步方法后是否自动保存结果，默认为 true
        isAutoSave: true,

        // 是否优先使用内存中的缓存，默认为 true
        isEnableCache: true,
    },
    { key: 'item key2 for load' },
    { key: 'item key3 for load' },
])
```

3.批量删除数据

```js
// 调用实例的 remove 函数来批量删除数据
tuaStorage.remove([
    'item key1 for remove',
    'item key2 for remove',
    'item key3 for remove',
])
```

## 5.保存数据永不超时
设置 expires 为 null 则缓存永不过期。

```js
tuaStorage.save({
    key: 'item never expired',
    data: 'some data',
    expires: null, // 永不过期
})
```

## 6.不使用前缀
保存数据时使用 fullKey，则不自动添加前缀，且可以直接通过 fullKey 读取数据。

```js
tuaStorage.save({
    fullKey: 'this is fullKey',
    data: 'some data',
})

tuaStorage.load({
    fullKey: 'this is fullKey',
})

// 为了兼容之前直接调用的方式，采用传递对象的方法
tuaStorage.remove({
    fullKey: 'this is fullKey',
})
```

## 7.并发相同请求只请求一次
同时读取同一个不存在的数据，只调用一次同步函数。

```js
tuaStorage.load({
    key: 'this is key',
    syncFn: () => {
        console.log(1) // 会被调用
        return Promise.resolve('returned data')
    },
    syncParams: {
        ParamOne: 'one',
        ParamTwo: 'two',
    },
})

// 连续调用相同的请求，则共用第一个 syncFn
// （即只有第一个 syncFn 会被调用）
tuaStorage.load({
    key: 'this is key',
    syncFn: () => {
        console.log(2) // 不会被调用
        return Promise.resolve('returned data')
    },
    syncParams: {
        ParamOne: 'one',
        ParamTwo: 'two',
    },
})

// 1
```

## 8.过期数据的清理
### 8.1.保存数据时若 `expires <= 0` 则不缓存数据

### 8.2.启动时遍历缓存，清除过期数据

### 8.3.启动时开启轮询每分钟清除过期数据

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, StEve Young

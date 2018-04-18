/* global Page */

import { version } from '../package.json'

console.log(`Tua-Mp Version: ${version}`)

const COMMON_PROP = {
    enumerable: true,
    configurable: true,
}
const isFn = fn => typeof fn === 'function'

// 全局变量，缓存下一个状态的数据
let newState = null

/**
 * 异步 setData 提高性能
 * @param {Page|Component} vm Page 或 Component 实例
 */
const getAsyncSetData = (vm) => ({
    newData,
    watchFn,
    path,
    oldVal,
}) => {
    newState = {
        ...newState,
        ...newData,
    }

    // TODO: Promise -> MutationObserve -> setTimeout
    Promise.resolve().then(() => {
        if (!newState) return

        vm.setData({
            // 因为不知道依赖所以更新整个 computed
            ...vm.$computed,
            ...newState,
        })

        if (isFn(watchFn)) {
            watchFn.call(vm, newState[path], oldVal)
        }

        newState = null
    })
}

/**
 * 将 source 上的属性代理到 target 上
 * @param {Object} source 被代理对象
 * @param {Object} target 被代理目标
 */
const proxyData = (source, target) => {
    Object.keys(source).forEach((key) => {
        Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
        )
    })
}

/**
 * 观察 obj[key]，当触发 setter 时调用 asyncSetData 更新数据
 * @param {Object} param
 * @param {Object} param.obj 被观察对象
 * @param {String} param.key 被观察对象的属性
 * @param {any} param.val 被观察对象的属性的值
 * @param {String} param.path 被观察对象的属性的路径
 * @param {fucntion} param.watchFn 被观察对象的属性的监听回调函数
 * @param {fucntion} param.asyncSetData 绑定了 vm 的异步 setData 函数
 */
const defineReactive = ({
    obj,
    key,
    val,
    path,
    watchFn,
    asyncSetData,
}) => {
    Object.defineProperty(obj, key, {
        ...COMMON_PROP,
        get () { return val },
        set (newVal) {
            if (newVal === val) return

            const oldVal = val
            val = newVal

            asyncSetData({
                newData: { [path]: newVal },
                watchFn,
                path,
                oldVal,
            })
        },
    })
}

/**
 * 劫持数组的方法
 * TODO: __proto__
 * @param {Object} param
 * @param {Array} param.arr 原始数组
 * @param {String} param.prefix 路径前缀
 * @param {fucntion} param.asyncSetData 绑定了 vm 的异步 setData 函数
 * @return {Array} observedArr 被劫持方法后的数组
 */
const observeArray = ({
    arr,
    prefix,
    asyncSetData,
}) => {
    ;[
        'pop',
        'push',
        'sort',
        'shift',
        'splice',
        'unshift',
        'reverse',
    ].forEach((method) => {
        const original = arr[method]

        arr[method] = function (...args) {
            const result = original.apply(this, args)

            asyncSetData({ newData: { [prefix]: arr } })

            return result
        }

        // TODO: insert
    })

    return arr
}

/**
 * 得到递归观察对象
 * @param {Object} watch 侦听器对象
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 * @return {function} observeDeep 递归观察函数
 */
const getObserveDeep = (watch) => (asyncSetData) => {
    return function observeDeep (obj, prefix = '') {
        if (Array.isArray(obj)) {
            const arr = obj.map((obj, idx) => (
                observeDeep(obj, `${prefix}[${idx}]`)
            ))

            return observeArray({
                arr,
                prefix,
                asyncSetData,
            })
        }

        if (typeof obj === 'object') {
            const observedObj = Object.create(null)

            Object.keys(obj).forEach((key) => {
                // 过滤 __wxWebviewId__ 等内部属性
                if (/^__.*__$/.test(key)) return

                const path = prefix === ''
                    ? key
                    : `${prefix}.${key}`

                defineReactive({
                    obj: observedObj,
                    key,
                    val: observeDeep(obj[key], path),
                    path,
                    watchFn: watch[path],
                    asyncSetData,
                })
            })

            return observedObj
        }

        // 简单属性直接返回
        return obj
    }
}

/**
 * 遍历观察 vm.data 中的所有属性，并将其直接挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {function} observeDeep 递归观察函数
 */
const bindData = (vm, observeDeep) => {
    const $data = observeDeep(vm.data)
    vm.$data = $data

    // 代理 $data 到 vm 上
    proxyData($data, vm)
}

/**
 * 遍历观察 computed，绑定 watch 回调并将定义的新属性挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} computed 计算属性对象
 * @param {Object} watch 侦听器对象
 */
const bindComputed = (vm, computed, watch) => {
    const $computed = Object.create(null)

    Object.keys(computed).forEach((key) => {
        const oldVal = computed[key].call(vm)

        Object.defineProperty($computed, key, {
            ...COMMON_PROP,
            get () {
                const newVal = computed[key].call(vm)

                // 实现 watch computed 属性
                const watchFn = watch[key]
                if (isFn(watchFn) && newVal !== oldVal) {
                    watchFn.call(vm, newVal, oldVal)
                }

                return newVal
            },
            set () {},
        })
    })

    // 挂在 vm 上，在 data 变化时重新 setData
    vm.$computed = $computed

    // 代理 $computed 到 vm 上
    proxyData($computed, vm)

    // 初始化 computed 的数据
    vm.setData($computed)
}

/**
 * 适配 Vue 风格代码，使其支持在小程序中运行（告别不方便的 setData）
 * @param {Object} args Page 参数
 */
export const TuaPage = (args = {}) => {
    const {
        data: rawData = {},
        watch = {},
        methods = {},
        computed = {},
        ...rest
    } = args

    const data = isFn(rawData) ? rawData() : rawData

    Page({
        ...rest,
        ...methods,
        data,
        onLoad (...options) {
            const asyncSetData = getAsyncSetData(this)
            const observeDeep = getObserveDeep(watch)(asyncSetData)

            // 遍历递归观察 data
            bindData(this, observeDeep)

            // 遍历观察 computed
            bindComputed(this, computed, watch)

            rest.onLoad && rest.onLoad.apply(this, options)
        },
    })
}

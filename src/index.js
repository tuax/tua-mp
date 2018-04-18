/* global Page */

import { version } from '../package.json'

console.log(`Tua-Mp Version: ${version}`)

let newState = null

/**
 * 异步 setData 提高性能
 */
const asyncSetData = ({
    vm,
    newData,
    watchFn,
    prefix,
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

        if (typeof watchFn === 'function') {
            watchFn.call(vm, newState[prefix], oldVal)
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
 * 遍历观察 vm.data 中的所有属性，并将其直接挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} watch 侦听器对象
 */
const bindData = (vm, watch) => {
    const defineReactive = (obj, key, val, prefix) => {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () { return val },
            set (newVal) {
                if (newVal === val) return

                // 通过路径来找 watch 目标
                const watchFn = watch[prefix]

                const oldVal = val
                val = newVal

                const newData = {
                    // 直接设置
                    [prefix]: newVal,
                }

                asyncSetData({ vm, newData, watchFn, prefix, oldVal })
            },
        })
    }

    /**
     * 劫持数组的方法
     * TODO: __proto__
     * @param {Array} arr 原始数组
     * @param {String} prefix 路径前缀
     * @return {Array} observedArray 被劫持方法后的数组
     */
    const observeArray = (arr, prefix) => {
        const observedArray = arr.map(
            (item, idx) => observeDeep(item, `${prefix}[${idx}]`)
        )

        ;[
            'pop',
            'push',
            'sort',
            'shift',
            'splice',
            'unshift',
            'reverse',
        ].forEach((method) => {
            const original = observedArray[method]

            observedArray[method] = function (...args) {
                const result = original.apply(this, args)
                const newData = {
                    // 直接设置
                    [prefix]: observedArray,
                }

                asyncSetData({ vm, newData })

                return result
            }

            // TODO: insert
        })

        return observedArray
    }

    /**
     * 递归观察对象
     * @param {any} obj 待观察对象
     * @param {String} prefix 路径前缀
     * @return {any} 已被观察的对象
     */
    const observeDeep = (obj, prefix = '') => {
        if (Array.isArray(obj)) {
            return observeArray(obj, prefix)
        }

        if (typeof obj === 'object') {
            const observedObj = Object.create(null)

            Object.keys(obj).forEach((key) => {
                // 过滤 __wxWebviewId__ 等内部属性
                if (/^__.*__$/.test(key)) return

                const path = prefix === ''
                    ? key
                    : `${prefix}.${key}`

                defineReactive(
                    observedObj,
                    key,
                    observeDeep(obj[key], path),
                    path,
                )
            })

            return observedObj
        }

        // 简单属性直接返回
        return obj
    }

    const $data = observeDeep(vm.data)
    vm.$data = $data

    proxyData($data, vm)
}

/**
 * 将 computed 中定义的新属性挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} computed 计算属性对象
 * @param {Object} watch 侦听器对象
 */
const bindComputed = (vm, computed, watch) => {
    const $computed = Object.create(null)

    Object.keys(computed).forEach((key) => {
        const oldVal = computed[key].call(vm)

        Object.defineProperty($computed, key, {
            enumerable: true,
            configurable: true,
            get () {
                const newVal = computed[key].call(vm)

                // 实现 watch computed 属性
                const watchFn = watch[key]
                if (typeof watchFn === 'function' && newVal !== oldVal) {
                    watchFn.call(vm, newVal, oldVal)
                }

                return newVal
            },
            set () {},
        })
    })

    proxyData($computed, vm)

    // 挂在 vm 上，在 data 变化时重新 setData
    vm.$computed = $computed

    // 初始化
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

    const data = typeof rawData === 'function'
        ? rawData()
        : rawData

    Page({
        ...rest,
        ...methods,
        data,
        onLoad (...options) {
            bindData(this, watch)
            bindComputed(this, computed, watch)

            rest.onLoad && rest.onLoad.apply(this, options)
        },
    })
}

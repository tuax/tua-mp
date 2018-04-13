/* global Page */

import { version } from '../package.json'

console.log(`Tua-Wx Version: ${version}`)

/**
 * 将属性直接挂到 vm 上方便使用
 * @param {Object} data 被代理对象
 * @param {Page|Component} target 被代理目标
 */
const proxyData = (data, target) => {
    Object.keys(data).forEach((key) => {
        Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(data, key)
        )
    })
}

/**
 * 遍历观察 vm.data 中的所有属性，并将其直接挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 */
const bindData = (vm) => {
    const defineReactive = (obj, key, val) => {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () { return val },
            set (newVal) {
                if (newVal === val) return

                val = newVal
                vm.setData($data)
            },
        })
    }

    /**
     * 劫持数组的方法
     * @param {Array} arr 原始数组
     * @return {Array} observedArray 被劫持方法后的数组
     */
    const observeArray = (arr) => {
        const observedArray = arr.map(observeDeep)

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

            observedArray[method] = function () {
                // http://jsperf.com/closure-with-arguments
                let i = arguments.length
                const args = new Array(i)
                while (i--) {
                    args[i] = arguments[i]
                }

                const result = original.apply(this, args)
                vm.setData($data)

                return result
            }
        })

        return observedArray
    }

    /**
     * 递归观察对象
     * @param {any} obj 待观察对象
     * @return {any} 已被观察的对象
     */
    const observeDeep = (obj) => {
        if (Array.isArray(obj)) {
            return observeArray(obj)
        }

        if (typeof obj === 'object') {
            const observedObj = Object.create(null)

            Object.keys(obj).forEach((key) => {
                // 过滤 __wxWebviewId__ 等内部属性
                if (/^__.*__$/.test(key)) return

                defineReactive(
                    observedObj,
                    key,
                    observeDeep(obj[key])
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
 * @param {Object} computed
 */
const bindComputed = (vm, computed) => {
    const $computed = Object.create(null)

    Object.keys(computed).forEach((key) => {
        Object.defineProperty($computed, key, {
            enumerable: true,
            configurable: true,
            get: computed[key].bind(vm),
            set () {},
        })
    })

    proxyData($computed, vm)
    proxyData($computed, vm.$data)

    // 初始化
    vm.setData($computed)
}

/**
 * 适配 Vue 风格代码，使其支持在小程序中运行（告别不方便的 setData）
 * TODO: 支持 computed、watch
 * @param {Object} args Page 参数
 */
export const TuaWxPage = (args = {}) => {
    const {
        data: rawData = {},
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
        onLoad () {
            // http://jsperf.com/closure-with-arguments
            let i = arguments.length
            const options = new Array(i)
            while (i--) {
                options[i] = arguments[i]
            }

            bindData(this)
            bindComputed(this, computed)

            rest.onLoad && rest.onLoad.apply(this, options)
        },
    })
}

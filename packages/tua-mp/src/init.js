import {
    isFn,
    logger,
    proxyData,
    getValByPath,
} from './utils/index'
import Dep from './observer/dep'
import { COMMON_PROP } from './constants'

/**
 * 遍历观察 vm.data 中的所有属性，并将其直接挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} data 传入的默认值对象
 * @param {function} observeDeep 递归观察函数
 */
export const bindData = (vm, data, observeDeep) => {
    const $data = observeDeep(data)
    vm.$data = $data

    // 代理 $data 到 vm 上
    proxyData($data, vm)
}

/**
 * 遍历观察 computed，绑定 watch 回调并将定义的新属性挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} computed 计算属性对象
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 */
export const bindComputed = (vm, computed, asyncSetData) => {
    const $computed = Object.create(null)

    Object.keys(computed).forEach((key) => {
        const dep = new Dep()
        const getVal = typeof computed[key] === 'function'
            ? computed[key].bind(vm)
            : computed[key].get.bind(vm)

        let oldVal
        let oldValStr
        let isInit = true

        Object.defineProperty($computed, key, {
            ...COMMON_PROP,
            get () {
                // 正在依赖收集
                if (Dep.targetCb) {
                    // 当前属性被依赖
                    dep.addSub(Dep.targetCb)
                }

                if (!isInit) return oldVal

                // 开始依赖收集
                Dep.targetCb = () => {
                    const newVal = getVal(vm)
                    const newValStr = JSON.stringify(newVal)

                    if (newValStr === oldValStr) return

                    asyncSetData({ path: key, newVal, oldVal })

                    // 重置 oldVal
                    oldVal = newVal
                    oldValStr = newValStr

                    dep.notify()
                }
                Dep.targetCb.key = key

                // 重置 oldVal
                oldVal = getVal(vm)
                oldValStr = JSON.stringify(oldVal)

                // 依赖收集完毕
                Dep.targetCb = null
                isInit = false

                return oldVal
            },
            set (...options) {
                if (typeof computed[key].set === 'undefined') {
                    logger.warn(`Computed property "${key}" was assigned to but it has no setter.`)
                } else {
                    const setVal = computed[key].set.bind(vm)
                    setVal(...options)
                }
            },
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
 * 初始化时触发 immediate 的 watch
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} watch 侦听器对象
 */
export const triggerImmediateWatch = (vm, watch) => Object.keys(watch)
    .forEach((key) => {
        const initialVal = getValByPath(vm)(key)

        if (Array.isArray(watch[key])) {
            watch[key]
                .filter(w => w.immediate)
                .forEach(({ handler }) => {
                    const watchFn = isFn(handler) ? handler : vm[handler]

                    watchFn.call(vm, initialVal)
                })
            return
        }

        if (!watch[key].immediate) return

        const watchFn = isFn(watch[key].handler)
            ? watch[key].handler
            : vm[watch[key].handler]

        watchFn.call(vm, initialVal)
    })

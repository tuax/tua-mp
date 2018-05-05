import {
    isFn,
    proxyData,
    COMMON_PROP,
} from './utils'

/**
 * 遍历观察 vm.data 中的所有属性，并将其直接挂到 vm 上
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {function} observeDeep 递归观察函数
 */
export const bindData = (vm, observeDeep) => {
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
export const bindComputed = (vm, computed, watch) => {
    const $computed = Object.create(null)

    Object.keys(computed).forEach((key) => {
        let oldVal = computed[key].call(vm)

        Object.defineProperty($computed, key, {
            ...COMMON_PROP,
            get () {
                const newVal = computed[key].call(vm)

                // 实现 watch computed 属性
                const watchFn = watch[key]
                if (isFn(watchFn) && newVal !== oldVal) {
                    watchFn.call(vm, newVal, oldVal)
                }

                // 重置 oldVal
                oldVal = newVal

                return newVal
            },
            set () {
                console.warn(`[TUA-MP]: 请勿对 computed 属性 ${key} 赋值，它应该由 data 中的依赖自动计算得到！`)
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

import {
    isFn,
    hackSetData,
    checkReservedKeys,
} from './utils/index'
import {
    deleteVm,
    getAsyncSetData,
} from './asyncSetData'
import {
    getObserveDeep,
} from './observer/index'
import {
    bindData,
    bindComputed,
    triggerImmediateWatch,
} from './init'

/**
 * 适配 Vue 风格代码，生成小程序页面
 * @param {Object|Function} data 页面组件的内部数据
 * @param {Object} watch 侦听器对象
 * @param {Object} methods 页面组件的方法，包括事件响应函数和任意的自定义方法
 * @param {Object} computed 计算属性
 */
export const TuaPage = ({
    data: rawData = {},
    watch = {},
    methods = {},
    computed = {},
    ...rest
}) => Page({
    // 设置初始值，不然自定义组件的 props 中将先接收到非值
    data: isFn(rawData) ? rawData() : rawData,
    ...rest,
    ...methods,
    onLoad (...options) {
        rest.beforeCreate && rest.beforeCreate.apply(this, options)

        const data = isFn(rawData) ? rawData() : rawData
        const asyncSetData = getAsyncSetData(this, watch)
        const observeDeep = getObserveDeep(asyncSetData)

        // 检查是否使用了保留字
        checkReservedKeys(data, computed, methods)

        // 初始化数据
        this.setData(data)

        // 遍历递归观察 data
        bindData(this, data, observeDeep)

        // 遍历观察 computed
        bindComputed(this, computed, asyncSetData)

        // 触发 immediate watch
        triggerImmediateWatch(this, watch)

        // hack 原生 setData
        hackSetData(this)

        rest.onLoad && rest.onLoad.apply(this, options)
        rest.created && rest.created.apply(this, options)
    },
    onReady (...options) {
        rest.beforeMount && rest.beforeMount.apply(this, options)
        rest.onReady && rest.onReady.apply(this, options)
        rest.mounted && rest.mounted.apply(this, options)
    },
    onUnload (...options) {
        rest.beforeDestroy && rest.beforeDestroy.apply(this, options)

        // 从 VM_MAP 中删除自己
        deleteVm(this)

        rest.onUnload && rest.onUnload.apply(this, options)
        rest.destroyed && rest.destroyed.apply(this, options)
    },
})

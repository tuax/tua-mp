import { version } from '../package.json'
import {
    log,
    isFn,
    $emit,
    checkReservedKeys,
    getPropertiesFromProps,
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

log(`Version ${version}`)

/**
 * 适配 Vue 风格代码，生成小程序原生组件
 * @param {Object|Function} data 组件的内部数据
 * @param {Object|Function|Null} props 组件的对外属性
 * @param {Object} watch 侦听器对象
 * @param {Object} methods 组件的方法，包括事件响应函数和任意的自定义方法
 * @param {Object} computed 计算属性
 * @param {Object|Function|Null} properties 小程序原生的组件的对外属性
 */
export const TuaComp = ({
    data: rawData = {},
    props = {},
    watch = {},
    methods = {},
    computed = {},
    properties = {},
    ...rest
}) => Component({
    ...rest,
    methods: { ...methods, $emit },
    properties: {
        ...properties,
        ...getPropertiesFromProps(props),
    },
    attached (...options) {
        const data = isFn(rawData) ? rawData() : rawData
        const asyncSetData = getAsyncSetData(this, watch)
        const observeDeep = getObserveDeep(asyncSetData)

        // 检查是否使用了保留字
        checkReservedKeys(data, computed, methods)

        // 初始化数据
        this.setData(data)

        // 遍历递归观察 data
        bindData(this, { ...this.data, ...data }, observeDeep)

        // 遍历观察 computed
        bindComputed(this, computed, asyncSetData)

        // 触发 immediate watch
        triggerImmediateWatch(this, watch)

        rest.attached && rest.attached.apply(this, options)
    },
    detached (...options) {
        // 从 VM_MAP 中删除自己
        deleteVm(this)

        rest.detached && rest.detached.apply(this, options)
    },
})

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
    ...rest,
    ...methods,
    onLoad (...options) {
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

        rest.onLoad && rest.onLoad.apply(this, options)
    },
    onUnload (...options) {
        // 从 VM_MAP 中删除自己
        deleteVm(this)

        rest.onUnload && rest.onUnload.apply(this, options)
    },
})

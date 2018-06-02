import { version } from '../package.json'
import {
    isFn,
    $emit,
    getPropertiesFromProps,
} from './utils/index'
import { deleteVm, getAsyncSetData } from './asyncSetData'
import {
    getObserveDeep,
} from './observer/index'
import {
    bindData,
    bindComputed,
} from './init'

console.log(`[TUA-MP]: Version ${version}`)

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
}) => {
    const data = isFn(rawData) ? rawData() : rawData

    return Component({
        ...rest,
        data,
        methods: { ...methods, $emit },
        properties: {
            ...properties,
            ...getPropertiesFromProps(props),
        },
        attached (...options) {
            const asyncSetData = getAsyncSetData(this, watch)
            const observeDeep = getObserveDeep(asyncSetData)

            // 遍历递归观察 data
            bindData(this, observeDeep)

            // 遍历观察 computed
            bindComputed(this, computed, asyncSetData)

            rest.attached && rest.attached.apply(this, options)
        },
        detached (...options) {
            // 从 VM_MAP 中删除自己
            deleteVm(this)

            rest.detached && rest.detached.apply(this, options)
        },
    })
}

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
}) => {
    const data = isFn(rawData) ? rawData() : rawData

    return Page({
        ...rest,
        ...methods,
        data,
        onLoad (...options) {
            const asyncSetData = getAsyncSetData(this, watch)
            const observeDeep = getObserveDeep(asyncSetData)

            // 遍历递归观察 data
            bindData(this, observeDeep)

            // 遍历观察 computed
            bindComputed(this, computed, asyncSetData)

            rest.onLoad && rest.onLoad.apply(this, options)
        },
        onUnload (...options) {
            // 从 VM_MAP 中删除自己
            deleteVm(this)

            rest.onUnload && rest.onUnload.apply(this, options)
        },
    })
}

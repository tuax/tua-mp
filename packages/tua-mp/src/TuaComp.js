import {
    isFn,
    $emit,
    hackSetData,
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
    created (...options) {
        rest.beforeCreate && rest.beforeCreate.apply(this, options)
        rest.created && rest.created.apply(this, options)
    },
    attached (...options) {
        rest.beforeMount && rest.beforeMount.apply(this, options)

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

        // hack 原生 setData
        hackSetData(this)

        rest.attached && rest.attached.apply(this, options)
    },
    ready (...options) {
        rest.ready && rest.ready.apply(this, options)
        rest.mounted && rest.mounted.apply(this, options)
    },
    detached (...options) {
        rest.beforeDestroy && rest.beforeDestroy.apply(this, options)

        // 从 VM_MAP 中删除自己
        deleteVm(this)

        rest.detached && rest.detached.apply(this, options)
        rest.destroyed && rest.destroyed.apply(this, options)
    },
})

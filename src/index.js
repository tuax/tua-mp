import {
    warn,
    isFn,
    toRawType,
    assertProp,
    isPlainObject,
    getPropertiesFromProps,
} from './utils'
import {
    TYPES,
} from './constants'
import {
    getObserveDeep,
    getAsyncSetData,
} from './observer/index'
import {
    bindData,
    bindComputed,
} from './init'

/**
 * 适配 Vue 风格代码，使其支持在小程序中运行（告别不方便的 setData）
 * @param {Object} args Component 参数
 */
export const TuaComp = (args) => {
    const {
        data: rawData,
        props = {},
        watch = {},
        methods = {},
        computed = {},
        properties = {},
        ...rest
    } = args

    const data = isFn(rawData) ? rawData() : rawData

    return Component({
        ...rest,
        data,
        methods,
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
    })
}

/**
 * 适配 Vue 风格代码，使其支持在小程序中运行（告别不方便的 setData）
 * @param {Object} args Page 参数
 */
export const TuaPage = (args) => {
    const {
        data: rawData,
        watch = {},
        methods = {},
        computed = {},
        ...rest
    } = args

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
    })
}

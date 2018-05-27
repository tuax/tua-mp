import {
    proxyData,
    hasProtoInObj,
} from '../utils/index'
import { __TUA_PATH__ } from '../constants'

const arrayProto = Array.prototype
const methodsToPatch = [
    'pop',
    'push',
    'sort',
    'shift',
    'splice',
    'unshift',
    'reverse',
]

/**
 * 改写数组原始的可变方法
 * @param {fucntion} observeDeep 递归观察函数
 * @param {fucntion} asyncSetData 绑定了 vm 的异步 setData 函数
 */
export const getArrayMethods = ({
    observeDeep,
    asyncSetData,
}) => {
    const arrayMethods = Object.create(arrayProto)

    methodsToPatch.forEach((method) => {
        const original = arrayProto[method]

        arrayMethods[method] = function (...args) {
            const path = this[__TUA_PATH__]
            const result = original.apply(this, args)

            if (method === 'pop') {
                asyncSetData({ path, newVal: this })
            } else {
                const newVal = observeDeep(this, path)

                // 直接改 this 就行了
                Object.assign(this, newVal)

                asyncSetData({ path, newVal, isArrDirty: true })
            }

            return result
        }
    })

    return arrayMethods
}

/**
 * 劫持数组的可变方法
 * @param {Array} arr 原始数组
 * @param {fucntion} arrayMethods 改写后的可变方法
 * @return {Array} 被劫持方法后的数组
 */
export const patchMethods2Array = ({
    arr,
    arrayMethods,
}) => {
    // 优先挂原型链上，否则劫持原方法
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(arr, arrayMethods)
    } else if (hasProtoInObj(arr)) {
        /* eslint-disable no-proto */
        arr.__proto__ = arrayMethods
        /* eslint-enable no-proto */
    } else {
        proxyData(arrayMethods, arr)
    }

    return arr
}

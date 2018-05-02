import { hasProto, proxyData } from '../utils'

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
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
 * 劫持数组的可变方法方法
 * @param {Object} param
 * @param {Array} param.arr 原始数组
 * @param {String} param.path 路径前缀
 * @param {fucntion} param.observeDeep 递归观察函数
 * @param {fucntion} param.asyncSetData 绑定了 vm 的异步 setData 函数
 * @return {Array} observedArr 被劫持方法后的数组
 */
export const observeArray = ({
    arr,
    path,
    observeDeep,
    asyncSetData,
}) => {
    methodsToPatch.forEach((method) => {
        const original = arrayProto[method]

        arrayMethods[method] = function (...args) {
            const result = original.apply(this, args)

            if (method === 'pop') {
                asyncSetData({ path, newVal: this })
            } else {
                asyncSetData({
                    path,
                    // 因为下标变了，所以要重新观察数组
                    newVal: observeDeep(this, path),
                    isArrDirty: true,
                })
            }

            return result
        }
    })

    // 如果有 __proto__ 就挂原型链上，否则劫持原方法
    // if (hasProto) {
    //     /* eslint-enable no-proto */
    //     arr.__proto__ = arrayMethods
    //     /* eslint-enable no-proto */
    // } else {
    //     proxyData(arrayMethods, arr)
    // }
    proxyData(arrayMethods, arr)

    return arr
}

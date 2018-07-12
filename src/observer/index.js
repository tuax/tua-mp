import {
    isNotInnerAttr,
    getPathByPrefix,
} from '../utils/index'
import {
    __dep__,
    COMMON_PROP,
    __TUA_PATH__,
} from '../constants'
import {
    getArrayMethods,
    patchMethods2Array,
} from './array'
import Dep from './dep'

/**
 * 观察 obj[key]，当触发 setter 时调用 asyncSetData 更新数据
 * @param {Object} obj 被观察对象
 * @param {String} key 被观察对象的属性
 * @param {any} val 被观察对象的属性的值
 * @param {function} observeDeep 递归观察函数
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 */
export const defineReactive = ({
    obj,
    key,
    val,
    observeDeep,
    asyncSetData,
}) => {
    const dep = obj[__dep__] || new Dep()

    Object.defineProperty(obj, __dep__, {
        value: dep,
        enumerable: false,
        configurable: true,
    })

    Object.defineProperty(obj, key, {
        ...COMMON_PROP,
        get: () => {
            // 正在依赖收集
            if (Dep.targetCb) {
                // 当前属性被依赖
                dep.addSub(Dep.targetCb)

                // 同时子属性也被依赖
                if (Array.isArray(val)) {
                    val.forEach((item) => {
                        item[__dep__] && item[__dep__].addSub(Dep.targetCb)
                    })

                    val[__dep__] = dep
                }
            }

            return val
        },
        set (newVal) {
            const oldVal = val
            const prefix = obj[__TUA_PATH__] || ''
            const path = getPathByPrefix(prefix, key)

            const isNeedInheritDep =
                newVal &&
                oldVal &&
                oldVal[__dep__] &&
                typeof newVal === 'object'

            // 继承依赖
            if (isNeedInheritDep) {
                newVal[__dep__] = oldVal[__dep__]
            }

            // 重新观察
            val = observeDeep(newVal, path)

            asyncSetData({ path, newVal, oldVal })

            // 触发依赖回调
            dep.notify()
        },
    })
}

/**
 * 得到递归观察对象
 * @param {function} asyncSetData 绑定了 vm 的异步 setData 函数
 * @return {function} observeDeep 递归观察函数
 */
export const getObserveDeep = (asyncSetData) => {
    /**
     * 递归观察函数
     * @param {Object} obj 待观察对象
     * @param {String} prefix 路径前缀
     * @return {Object} 被观察后的对象
     */
    return function observeDeep (obj, prefix = '') {
        if (Array.isArray(obj)) {
            const arr = obj

            arr.forEach((item, idx) => {
                // 继承依赖
                if (!item[__dep__] && obj[__dep__]) {
                    item[__dep__] = obj[__dep__]
                }

                return observeDeep(item, `${prefix}[${idx}]`)
            })

            // 每个数组挂载自己的路径
            arr[__TUA_PATH__] = prefix

            // 不缓存数组可变方法，因为 vm 可能不同
            const arrayMethods = getArrayMethods({
                observeDeep,
                asyncSetData,
            })

            return patchMethods2Array({ arr, arrayMethods })
        }

        if (obj !== null && typeof obj === 'object') {
            // 继承依赖
            if (obj[__dep__]) {
                Object.defineProperty(obj, __dep__, {
                    value: obj[__dep__],
                    enumerable: false,
                    configurable: true,
                })
            }

            // 将路径前缀挂在父节点上
            Object.defineProperty(obj, __TUA_PATH__, {
                value: prefix,
                enumerable: false,
                configurable: true,
            })

            Object.keys(obj)
                // 过滤 __wxWebviewId__ 等内部属性
                .filter(isNotInnerAttr)
                .map((key) => ({
                    obj,
                    key,
                    val: observeDeep(
                        obj[key],
                        getPathByPrefix(prefix, key)
                    ),
                    observeDeep,
                    asyncSetData,
                }))
                .forEach(defineReactive)

            return obj
        }

        // 其他属性直接返回
        return obj
    }
}

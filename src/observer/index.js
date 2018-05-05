import {
    isFn,
    __TUA_PATH,
    COMMON_PROP,
    setObjByPath,
    getPathByPrefix,
} from '../utils'
import { observeArray } from './array'

// 全局变量，缓存下一个状态的数据
let newState = null

/**
 * 异步 setData 提高性能
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} watch 侦听器对象
 * @param {Object} param
 * @param {String} param.path 属性的路径
 * @param {any} param.newVal 新值
 * @param {any} param.oldVal 旧值
 * @param {Boolean} param.isArrDirty 数组下标发生变化
 */
export const getAsyncSetData = (vm, watch) => ({
    path,
    newVal,
    oldVal,
    isArrDirty = false,
}) => {
    newState = { ...newState, [path]: newVal }

    // 数组下标发生变化，同步修改数组
    if (isArrDirty) {
        setObjByPath({ obj: vm, val: newVal, path })
    }

    // TODO: Promise -> MutationObserve -> setTimeout
    Promise.resolve().then(() => {
        if (!newState) return

        vm.setData({
            // 因为不知道依赖所以更新整个 computed
            ...vm.$computed,
            ...newState,
        })

        const watchFn = watch[path]
        if (isFn(watchFn)) {
            watchFn.call(vm, newState[path], oldVal)
        }

        newState = null
    })
}

/**
 * 观察 obj[key]，当触发 setter 时调用 asyncSetData 更新数据
 * @param {Object} param.obj 被观察对象
 * @param {String} param.key 被观察对象的属性
 * @param {any} param.val 被观察对象的属性的值
 * @param {function} param.observeDeep 递归观察函数
 * @param {fucntion} param.asyncSetData 绑定了 vm 的异步 setData 函数
 */
export const defineReactive = ({
    obj,
    key,
    val,
    observeDeep,
    asyncSetData,
}) => {
    Object.defineProperty(obj, key, {
        ...COMMON_PROP,
        get: () => val,
        set (newVal) {
            if (newVal === val) return

            const oldVal = val
            const prefix = obj[__TUA_PATH] || ''
            const path = getPathByPrefix(prefix, key)

            // 重新观察
            val = observeDeep(newVal, path)

            asyncSetData({
                path,
                newVal,
                oldVal,
            })
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
            const arr = obj.map((item, idx) =>
                observeDeep(item, `${prefix}[${idx}]`)
            )

            // 每个数组挂载自己的路径
            arr[__TUA_PATH] = prefix

            return observeArray({
                arr,
                observeDeep,
                asyncSetData,
            })
        }

        if (typeof obj === 'object') {
            const observedObj = Object.create(null)

            // 将路径前缀挂在父节点上
            Object.defineProperty(observedObj, __TUA_PATH, {
                enumerable: false,
                value: prefix,
            })

            Object.keys(obj).forEach((key) => {
                // 过滤 __wxWebviewId__ 等内部属性
                if (/^__.*__$/.test(key)) return

                defineReactive({
                    obj: observedObj,
                    key,
                    val: observeDeep(
                        obj[key],
                        getPathByPrefix(prefix, key)
                    ),
                    observeDeep,
                    asyncSetData,
                })
            })

            return observedObj
        }

        // 简单属性直接返回
        return obj
    }
}

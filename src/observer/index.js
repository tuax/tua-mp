import {
    isFn,
    setObjByPath,
    isNotInnerAttr,
    getPathByPrefix,
} from '../utils/index'
import {
    __TUA_PATH,
    COMMON_PROP,
} from '../constants'
import {
    getArrayMethods,
    patchMethods2Array,
} from './array'
import Dep from './dep'

// 全局变量，缓存下一个状态的数据
let newState = null

// 全局变量，缓存传给 asyncSetData 的 oldVal 值
// 以便在触发 watch 时获取
let oldState = null

// 缓存数组可变方法
let arrayMethods = null

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
    oldState = { [path]: oldVal, ...oldState }

    // 数组下标发生变化，同步修改数组
    if (isArrDirty) {
        setObjByPath({ obj: vm, val: newVal, path })
    }

    // TODO: Promise -> MutationObserve -> setTimeout
    Promise.resolve().then(() => {
        if (!newState) return

        vm.setData(newState)

        // 触发 watch
        Object.keys(newState)
            .filter(key => isFn(watch[key]))
            .forEach((key) => {
                const watchFn = watch[key]
                const newVal = newState[key]
                const oldVal = oldState[key]

                watchFn.call(vm, newVal, oldVal)
            })

        newState = null
        oldState = null
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
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        ...COMMON_PROP,
        get: () => {
            // 正在依赖收集
            if (Dep.targetCb) {
                // 当前属性被依赖
                dep.addSub(Dep.targetCb)
            }

            return val
        },
        set (newVal) {
            if (newVal === val) return

            const oldVal = val
            const prefix = obj[__TUA_PATH] || ''
            const path = getPathByPrefix(prefix, key)

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
            const arr = obj.map((item, idx) =>
                observeDeep(item, `${prefix}[${idx}]`)
            )

            // 每个数组挂载自己的路径
            arr[__TUA_PATH] = prefix

            // 缓存数组可变方法，不用每次重复求值
            arrayMethods = arrayMethods ||
                getArrayMethods({
                    observeDeep,
                    asyncSetData,
                })

            return patchMethods2Array({ arr, arrayMethods })
        }

        if (obj !== null && typeof obj === 'object') {
            const observedObj = Object.create(null)

            // 将路径前缀挂在父节点上
            Object.defineProperty(observedObj, __TUA_PATH, {
                enumerable: false,
                value: prefix,
            })

            Object.keys(obj)
                // 过滤 __wxWebviewId__ 等内部属性
                .filter(isNotInnerAttr)
                .map((key) => ({
                    obj: observedObj,
                    key,
                    val: observeDeep(
                        obj[key],
                        getPathByPrefix(prefix, key)
                    ),
                    observeDeep,
                    asyncSetData,
                }))
                .forEach(defineReactive)

            return observedObj
        }

        // 简单属性直接返回
        return obj
    }
}

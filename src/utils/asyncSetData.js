import {
    isFn,
    setObjByPath,
} from './index'

// 全局变量，缓存下一个状态的数据
let newState = null

// 全局变量，缓存传给 asyncSetData 的 oldVal 值
// 以便在触发 watch 时获取
let oldState = null

/**
 * 异步 setData 提高性能
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} watch 侦听器对象
 * @param {String} path 属性的路径
 * @param {any} newVal 新值
 * @param {any} oldVal 旧值
 * @param {Boolean} isArrDirty 数组下标发生变化
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

        console.log('newState', newState)

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

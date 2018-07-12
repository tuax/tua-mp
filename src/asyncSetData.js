import VmStatus from './VmStatus'
import { setObjByPath } from './utils/index'

const vmStatus = new VmStatus()

/**
 * 异步 setData 提高性能
 * @param {Page|Component} vm Page 或 Component 实例
 * @param {Object} watchObj 侦听器对象
 * @param {String} path 属性的路径
 * @param {any} newVal 新值
 * @param {any} oldVal 旧值
 * @param {Boolean} isArrDirty 数组下标发生变化
 */
export const getAsyncSetData = (vm, watchObj) => ({
    path,
    newVal,
    oldVal,
    isArrDirty = false,
}) => {
    // 统一转成数组
    const watch = Object.keys(watchObj)
        .map((key) => Array.isArray(watchObj[key])
            ? { [key]: watchObj[key] }
            : { [key]: [ watchObj[key] ] }
        )
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

    const deepWatch = Object.keys(watch)
        .filter((key) => watch[key].some(w => w.deep))
        .map(key => ({ [key]: watch[key].filter(w => w.deep) }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

    vmStatus.updateState({ vm, watch, deepWatch, path, newVal, oldVal })

    // 数组下标发生变化，同步修改数组
    if (isArrDirty) {
        setObjByPath({ obj: vm, val: newVal, path })
    }

    Promise.resolve()
        .then(vmStatus.flushState.bind(vmStatus))
}

/**
 * 在页面 onUnload 或组件 detached 后，
 * 将 vm 从 VM_MAP 中删除
 */
export const deleteVm = vmStatus.deleteVm.bind(vmStatus)

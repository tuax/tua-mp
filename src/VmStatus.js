import { isFn } from './utils/index'

/**
 * 根据 vm 生成 key
 * @param {String} __wxWebviewId__ webview 的 id
 * @param {String} __wxExparserNodeId__ 组件的 id
 */
const getKeyFromVM = ({
    __wxWebviewId__: wId,
    __wxExparserNodeId__: nId = 'wxExparserNodeId',
}) => `${wId}_${nId}`

/**
 * 这个类负责管理 vm 的状态，在更新数据时保存状态，
 * 然后异步地进行更新，并且触发相关 watch 函数
 */
export default class VmStatus {
    constructor () {
        // 根据 key 保存 vm
        this.VM_MAP = Object.create(null)

        // 缓存各个 vm 下一个状态的数据
        this.newStateByVM = Object.create(null)

        // 缓存各个 vm 传给 asyncSetData 的 oldVal 值
        // 以便在触发 watch 时获取
        this.oldStateByVM = Object.create(null)
    }

    /**
     * 更新状态
     * @param {Page|Component} vm Page 或 Component 实例
     * @param {Object} watch 侦听器对象
     * @param {String} path 属性的路径
     * @param {any} newVal 新值
     * @param {any} oldVal 旧值
     */
    updateState ({ vm, watch, path, newVal, oldVal }) {
        const key = getKeyFromVM(vm)

        this.newStateByVM = {
            ...this.newStateByVM,
            [key]: { ...this.newStateByVM[key], [path]: newVal },
        }
        this.oldStateByVM = {
            ...this.oldStateByVM,
            [key]: { [path]: oldVal, ...this.oldStateByVM[key] },
        }

        // 缓存 vm 和 watch
        if (!this.VM_MAP[key]) {
            this.VM_MAP[key] = { vm, watch }
        }
    }

    /**
     * 刷新状态，调用 vm.setData 向小程序提交数据
     * 并触发相关 watch
     */
    flushState () {
        const vmKeys = Object.keys(this.newStateByVM)

        vmKeys
            .filter(vmKey => this.VM_MAP[vmKey])
            .forEach((vmKey) => {
                const { vm, watch } = this.VM_MAP[vmKey]
                const newState = this.newStateByVM[vmKey]
                const oldState = this.oldStateByVM[vmKey]

                // 更新数据
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
            })

        this.newStateByVM = Object.create(null)
        this.oldStateByVM = Object.create(null)
    }

    deleteVm (vm) {
        const key = getKeyFromVM(vm)

        delete this.VM_MAP[key]
    }
}

import {
    isFn,
    setObjByPath,
} from './basic'

export const hackSetData = (vm) => {
    const originalSetData = vm.setData

    Object.defineProperties(vm, {
        'setData': {
            get: () => (newVal, cb) => {
                Object.keys(newVal)
                    .forEach((path) => {
                        // 针对 vm 上的属性赋值
                        setObjByPath({ obj: vm, path, val: newVal[path], isCheckDef: true })

                        // 针对 vm.data 上的属性赋值
                        setObjByPath({ obj: vm.data, path, val: newVal[path] })
                    })

                isFn(cb) && Promise.resolve().then(cb)
            },
        },
        '__setData__': { get: () => originalSetData },
    })
}

import {
    isFn,
    setObjByPath,
} from './basic'

export const hackSetData = (vm) => {
    const originalSetData = vm.setData

    Object.defineProperties(vm, {
        'setData': {
            get: () => (newVal, cb) => Object.keys(newVal)
                .forEach((pathStr) => {
                    setObjByPath({ obj: vm, path: pathStr, val: newVal[pathStr] })

                    isFn(cb) && Promise.resolve().then(cb)
                }),
        },
        '__setData__': { get: () => originalSetData },
    })
}

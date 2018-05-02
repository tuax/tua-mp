import {
    getObserveDeep,
    getAsyncSetData,
} from '../../src/observer'
import { observeArray } from '../../src/observer/array'
import { afterSetData } from '../utils'

const watch = {
    steve: jest.fn(() => {}),
}

const getVm = () => Page({
    data: {
        steve: 'steve',
        young: 'young',
        array: [1, 2, 3],
        nested: {
            young: 'young',
            __wxWebviewId__: 1,
        },
        nestedArr: [],
    },
})

let vm = getVm()
let asyncSetData = jest.fn(getAsyncSetData(vm, watch))

describe('observe functions', () => {
    afterEach(() => {
        vm = getVm()
        asyncSetData = jest.fn(getAsyncSetData(vm, watch))
    })

    test('observe new value inserted into Array', (done) => {
        const arr = []
        const path = 'arr'
        const observeDeep = jest.fn(getObserveDeep(asyncSetData))

        observeArray({
            arr,
            path,
            observeDeep,
            asyncSetData,
        })

        // 插入对象
        arr.push({ a: 'inserted value' })
        // 修改数组中的对象
        arr[0].a = 'a'
        // 插入含有对象的数组
        arr.unshift([{ arrObj: 'arrObj' }])
        // 修改数组中的数组中的对象
        arr[0][0].arrObj = 'b'

        afterSetData(() => {
            expect(arr[0][0].arrObj).toBe('b')
            expect(arr[1].a).toBe('a')
            expect(asyncSetData).toHaveBeenCalledTimes(2)
            expect(observeDeep).toHaveBeenCalledTimes(2)
            expect(observeDeep).toBeCalledWith(arr, path)
            done()
        })
    })

    test('observeArray', () => {
        const arr = []
        const path = 'arr'
        const newVal = 'this is new a'
        const observeDeep = jest.fn(getObserveDeep(asyncSetData))

        observeArray({
            arr,
            path,
            observeDeep,
            asyncSetData,
        })

        arr.push(1)
        expect(observeDeep).toBeCalledWith(arr, path)
        arr.pop()
        expect(asyncSetData).toBeCalledWith({ path, newVal: arr })
        arr.sort()
        expect(observeDeep).toBeCalledWith(arr, path)
        arr.splice(0, 0, 2)
        expect(observeDeep).toBeCalledWith(arr, path)
    })
})

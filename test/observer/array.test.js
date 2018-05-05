import {
    getObserveDeep,
    getAsyncSetData,
} from '../../src/observer'
import { __TUA_PATH } from '../../src/utils'
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

    test('no __proto__', (done) => {
        const arr = []
        const path = 'arr'
        const observeDeep = jest.fn(getObserveDeep(asyncSetData))
        arr[__TUA_PATH] = path
        Object.setPrototypeOf = null
        arr.__proto__ = null
        arr.map = [].map

        observeArray({
            arr,
            observeDeep,
            asyncSetData,
        })

        // 插入对象
        arr.splice(0, 0, { a: 'inserted value' })
        // 修改数组中的对象
        arr[0].a = 'a'
        // 插入含有对象的数组
        arr.unshift([{ arrObj: 'arrObj' }])
        // 修改数组中的数组中的对象
        arr[0][0].arrObj = 'b'

        afterSetData(() => {
            expect(arr[0][0].arrObj).toBe('b')
            expect(arr[1].a).toBe('a')
            expect([].hasOwnProperty.call(arr, 'push')).toBe(true)
            expect(asyncSetData).toHaveBeenCalledTimes(2)
            expect(observeDeep).toBeCalledWith(arr, path)
            done()
        })
    })

    test('no Object.setPrototypeOf', (done) => {
        const arr = []
        const path = 'arr'
        const observeDeep = jest.fn(getObserveDeep(asyncSetData))
        arr[__TUA_PATH] = path
        Object.setPrototypeOf = null

        observeArray({
            arr,
            observeDeep,
            asyncSetData,
        })

        // 插入对象
        arr.splice(0, 0, { a: 'inserted value' })
        // 修改数组中的对象
        arr[0].a = 'a'
        // 插入含有对象的数组
        arr.unshift([{ arrObj: 'arrObj' }])
        // 修改数组中的数组中的对象
        arr[0][0].arrObj = 'b'

        afterSetData(() => {
            expect(arr[0][0].arrObj).toBe('b')
            expect(arr[1].a).toBe('a')
            expect(arr.hasOwnProperty('push')).toBe(false)
            expect(asyncSetData).toHaveBeenCalledTimes(2)
            expect(observeDeep).toBeCalledWith(arr, path)
            done()
        })
    })

    test('observe new value inserted into array', (done) => {
        const arr = []
        const path = 'arr'
        const observeDeep = jest.fn(getObserveDeep(asyncSetData))
        arr[__TUA_PATH] = path

        observeArray({
            arr,
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
            expect(observeDeep).toBeCalledWith(arr, path)
            done()
        })
    })

    test('observe array with simple value', () => {
        const arr = []
        const path = 'arr'
        const newVal = 'this is new a'
        const observeDeep = jest.fn(getObserveDeep(asyncSetData))
        arr[__TUA_PATH] = path

        observeArray({
            arr,
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
        arr.unshift(9)
        expect(observeDeep).toBeCalledWith(arr, path)
        arr.shift()
        expect(observeDeep).toBeCalledWith(arr, path)
        arr.reverse()
        expect(observeDeep).toBeCalledWith(arr, path)
    })
})

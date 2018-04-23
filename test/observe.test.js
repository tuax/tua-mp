import {
    bindData,
    bindComputed,
    observeArray,
    getObserveDeep,
    defineReactive,
    getAsyncSetData,
} from '../src/observe'
import { afterSetData } from './utils'

const watch = {
    steve: jest.fn(() => {}),
}

let vm = Page({
    data: {
        steve: 'steve',
        young: 'young',
        array: [1, 2, 3],
        nested: {
            young: 'young',
            __wxWebviewId__: 1,
        },
    },
})
let asyncSetData = jest.fn(getAsyncSetData(vm, watch))

describe('observe functions', () => {
    afterEach(() => {
        vm = Page({
            data: {
                steve: 'steve',
                young: 'young',
                array: [1, 2, 3],
                nested: {
                    young: 'young',
                    __wxWebviewId__: 1,
                },
            },
        })

        asyncSetData = jest.fn(getAsyncSetData(vm, watch))
    })

    test('bindComputed', (done) => {
        const computed = {
            sAndY () {
                return this.steve + this.young
            },
        }
        const watch = {
            sAndY: jest.fn(() => {}),
        }
        const oldVal = 'steveyoung'
        const newVal = 'abcyoung'
        const observeDeep = getObserveDeep(asyncSetData)
        bindData(vm, observeDeep)
        bindComputed(vm, computed, watch)

        expect(vm.sAndY).toBe(vm.data.sAndY)
        expect(vm.sAndY).toBe(vm.$computed.sAndY)
        expect(vm.sAndY).toBe(oldVal)
        vm.steve = 'abc'

        afterSetData(() => {
            expect(vm.sAndY).toBe(newVal)
            expect(watch.sAndY).toBeCalledWith(newVal, oldVal)
            done()
        })
    })

    test('bindData', () => {
        const observeDeep = getObserveDeep(asyncSetData)
        bindData(vm, observeDeep)

        expect(vm.steve).toBe(vm.data.steve)
        expect(vm.steve).toBe(vm.$data.steve)
        expect(vm.nested.young).toBe(vm.data.nested.young)
        expect(vm.nested.young).toBe(vm.$data.nested.young)
    })

    test('getObserveDeep', () => {
        const obj = {
            steve: 'steve',
            array: [1, 2, 3],
            nested: {
                young: 'young',
                __wxWebviewId__: 1,
            },
        }
        const newVal = 'StEve'
        const newArr = []
        const observeDeep = getObserveDeep(asyncSetData)
        const ob = observeDeep(obj)

        ob.steve = newVal
        ob.nested.young = newVal
        expect(asyncSetData).toBeCalledWith({
            newVal,
            path: 'steve',
            oldVal: 'steve',
        })
        expect(asyncSetData).toBeCalledWith({
            newVal,
            path: 'nested.young',
            oldVal: 'young',
        })
    })

    test('observeArray', () => {
        const arr = []
        const val = 'this is a'
        const path = 'arr'
        const newVal = 'this is new a'

        observeArray({ arr, path, asyncSetData })

        arr.push(1)
        expect(asyncSetData).toBeCalledWith({ path, newVal: arr })
        arr.sort()
        expect(asyncSetData).toBeCalledWith({ path, newVal: arr })
        arr.splice(0, 0, 2)
        expect(asyncSetData).toBeCalledWith({ path, newVal: arr })
    })

    test('defineReactive', () => {
        const obj = {}
        const key = 'a'
        const val = 'this is a'
        const newVal = 'this is new a'

        defineReactive({
            obj,
            key,
            val,
            path: key,
            asyncSetData,
        })

        expect(obj.a).toBe(val)
        obj.a = newVal
        obj.a = newVal
        expect(obj.a).toBe(newVal)
        expect(asyncSetData).toBeCalledWith({
            path: key,
            newVal,
            oldVal: val,
        })
        expect(asyncSetData).toHaveBeenCalledTimes(1)
    })

    test('setData should only be called once', (done) => {
        let num = 0
        asyncSetData({ path: 'steve', newVal: num++, oldVal: 'steve' })
        asyncSetData({ path: 'young', newVal: num++, oldVal: 'young' })
        asyncSetData({ path: 'steve', newVal: num++, oldVal: 'steve' })

        afterSetData(() => {
            expect(vm.data.steve).toBe(--num)
            expect(vm.setData).toHaveBeenCalledTimes(1)
            expect(vm.setData).toBeCalledWith({
                steve: num,
                young: num - 1,
            })
            expect(watch.steve).toBeCalledWith(num, 'steve')
            done()
        })
    })
})

import {
    getObserveDeep,
    defineReactive,
} from '../../src/observer/'
import {
    getAsyncSetData,
} from '../../src/asyncSetData'
import { afterSetData } from '../utils'

const watch = {
    steve: jest.fn(),
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
let observeDeep = jest.fn(getObserveDeep(asyncSetData))

describe('observe functions', () => {
    afterEach(() => {
        vm = getVm()
        asyncSetData = jest.fn(getAsyncSetData(vm, watch))
        observeDeep = jest.fn(getObserveDeep(asyncSetData))
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
        const newNested = { young: 'yo' }
        const newArr = [{ msg: 'abc' }]
        const ob = observeDeep(obj)

        ob.array = newArr
        ob.array[0].msg = 'young'

        ob.steve = newVal
        ob.nested = newNested
        ob.nested.young = newVal

        expect(asyncSetData).toBeCalledWith({
            newVal: 'young',
            path: 'array[0].msg',
            oldVal: 'abc',
        })
        expect(asyncSetData).toBeCalledWith({
            newVal,
            path: 'steve',
            oldVal: 'steve',
        })
        expect(asyncSetData).toBeCalledWith({
            newVal: newNested,
            path: 'nested',
            oldVal: { young: 'young' },
        })
        expect(asyncSetData).toBeCalledWith({
            newVal,
            path: 'nested.young',
            oldVal: 'yo',
        })
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
            observeDeep,
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
        // fix #35
        // 允许重复设置相同的值，因为可能就是有数据不一致的情况
        expect(asyncSetData).toHaveBeenCalledTimes(2)
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

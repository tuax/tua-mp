import {
    getObserveDeep,
    defineReactive,
    getAsyncSetData,
} from '../../src/observer'
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

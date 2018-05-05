import {
    bindData,
    bindComputed,
} from '../src/init'
import {
    getObserveDeep,
    getAsyncSetData,
} from '../src/observer'
import { afterSetData } from './utils'

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

    test('assign value to computed', (done) => {
        const computed = {
            sAndY () {
                return this.steve + this.young
            },
        }
        const observeDeep = getObserveDeep(asyncSetData)
        bindData(vm, observeDeep)
        bindComputed(vm, computed, {})

        vm.sAndY = 'sth'

        afterSetData(() => {
            expect(vm.sAndY).toBe('steveyoung')
            done()
        })
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
})

import {
    bindData,
    bindComputed,
} from '../src/init'
import {
    getObserveDeep,
} from '../src/observer/'
import {
    getAsyncSetData,
} from '../src/utils/'
import { afterSetData } from './utils'

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

describe('observe functions', () => {
    afterEach(() => {
        vm = getVm()
        asyncSetData = jest.fn(getAsyncSetData(vm, watch))
    })

    test('computed from computed', (done) => {
        const plusHey = x => x + 'hey'
        const computed = {
            sAndY () {
                return this.steve + this.young
            },
            sFirst () {
                return this.steve.split('')[0]
            },
            syPlusHey () {
                return plusHey(this.sAndY)
            },
            nestedArrLen () {
                return this.nestedArr.length
            },
            sAndsyPlusHey () {
                return this.sFirst + this.syPlusHey
            },
        }
        const watch = {
            syPlusHey: jest.fn(),
            nestedArrLen: jest.fn(),
            sAndsyPlusHey: jest.fn(),
        }
        const oldVal = 'steveyoung'
        const newVal1 = 'yoyoung'
        const newVal2 = 'yowow'
        const asyncSetData = jest.fn(getAsyncSetData(vm, watch))
        const observeDeep = getObserveDeep(asyncSetData)

        bindData(vm, observeDeep)
        bindComputed(vm, computed, asyncSetData)

        expect(vm.syPlusHey).toBe(plusHey(oldVal))
        expect(vm.sAndsyPlusHey).toBe('s' + plusHey(oldVal))
        vm.steve = 'yo'

        afterSetData(() => {
            expect(vm.syPlusHey).toBe(plusHey(newVal1))
            expect(watch.syPlusHey).toBeCalledWith(plusHey(newVal1), plusHey(oldVal))

            expect(vm.sAndsyPlusHey).toBe('y' + plusHey(newVal1))
            expect(watch.sAndsyPlusHey).toBeCalledWith('y' + plusHey(newVal1), 's' + plusHey(oldVal))

            vm.young = 'wow'
            afterSetData(() => {
                expect(vm.syPlusHey).toBe(plusHey(newVal2))
                expect(watch.syPlusHey).toBeCalledWith(plusHey(newVal2), plusHey(newVal1))

                expect(vm.sAndsyPlusHey).toBe('y' + plusHey(newVal2))
                expect(watch.sAndsyPlusHey).toBeCalledWith('y' + plusHey(newVal2), 'y' + plusHey(newVal1))
                expect(watch.nestedArrLen).toHaveBeenCalledTimes(2)
                done()
            })
        })
    })

    test('assign value to computed', (done) => {
        const computed = {
            sAndY () {
                return this.steve + this.young
            },
        }
        const observeDeep = getObserveDeep(asyncSetData)

        bindData(vm, observeDeep)
        bindComputed(vm, computed, asyncSetData)

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
            sAndY: jest.fn(),
        }
        const oldVal = 'steveyoung'
        const newVal1 = 'abcyoung'
        const newVal2 = 'abc123'
        const asyncSetData = jest.fn(getAsyncSetData(vm, watch))
        const observeDeep = getObserveDeep(asyncSetData)

        bindData(vm, observeDeep)
        bindComputed(vm, computed, asyncSetData)

        expect(vm.sAndY).toBe(vm.data.sAndY)
        expect(vm.sAndY).toBe(vm.$computed.sAndY)
        expect(vm.sAndY).toBe(oldVal)
        vm.steve = 'abc'

        afterSetData(() => {
            expect(vm.sAndY).toBe(newVal1)
            expect(watch.sAndY).toBeCalledWith(newVal1, oldVal)

            vm.young = '123'
            afterSetData(() => {
                expect(vm.sAndY).toBe(newVal2)
                expect(watch.sAndY).toBeCalledWith(newVal2, newVal1)
                done()
            })
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

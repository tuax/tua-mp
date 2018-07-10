import { TuaComp, TuaPage } from '../src'
import { afterSetData } from './utils'

const event = {
    "currentTarget": {
        "id": "",
        "offsetLeft": 0,
        "offsetTop": 0,
        "dataset": { "index": 0 }
    },
    "detail": { "value": [] }
}

const eventVal = {
    "value": [],
    "index": 0
}

describe('TuaComp', () => {
    test('use it just like MINA', (done) => {
        const vm = TuaComp({
            properties: {
                propA: String,
                propB: {
                    type: Number,
                },
                propC: {
                    type: String,
                    value: 'steve',
                },
            },
            data: {
                compData: 'compData',
            },
            detached () {},
            methods: {
                onChangeVal (e) {
                    this.$emit('onChangeVal', e)
                },
                onEmitVal () {
                    this.$emit('onEmitVal')
                },
                triggerEvent: jest.fn(),
            },
        })

        vm.compData = 'steve'
        expect(vm.propA).toBe('')
        expect(vm.propB).toBe(0)
        expect(vm.propC).toBe('steve')
        expect(vm.compData).toBe('steve')

        vm.onChangeVal(event)
        expect(vm.triggerEvent).toBeCalledWith('onChangeVal', eventVal, undefined)

        vm.onEmitVal()
        expect(vm.triggerEvent).toBeCalledWith('onEmitVal', {}, undefined)

        afterSetData(() => {
            vm.detached()
            expect(vm.data.compData).toBe('steve')
            done()
        })
    })

    test('use it just like Vue', () => {
        const watchFn = jest.fn()
        const vm = TuaComp({
            props: {
                propA: Number,
                propB: [String, Number],
                propC: {
                    type: String,
                    required: true,
                },
                propD: {
                    type: Number,
                    default: 100,
                },
                propE: {
                    type: Object,
                    default: () => ({ message: 'hello' }),
                },
                propF: {
                    validator (value) {
                        return ['success', 'warning', 'danger'].indexOf(value) !== -1
                    },
                },
            },
            computed: {
                dAndE () {
                    return this.propD + this.propE.message
                },
            },
        })
        const newVal = 'StEve'

        expect(vm.propA).toBe(0)
        expect(vm.propB).toBe('')
        expect(vm.propC).toBe('')
        expect(vm.propD).toBe(100)
        expect(vm.propE.message).toBe('hello')
        expect(vm.propF).toBe('')
        expect(vm.dAndE).toBe('100hello')
    })

    test('edge case', () => {
        const data = jest.fn(() => ({}))
        const attached = jest.fn()
        TuaComp({ data, attached })

        expect(data).toBeCalled()
        expect(attached).toBeCalled()
    })

    // close #37
    test('not plain object data', () => {
        const now = new Date()
        const hour = now.getHours()

        const vm = TuaComp({
            data () {
                return { now }
            },
            computed: {
                hour () {
                    return this.now.getHours()
                },
            },
        })

        expect(hour).toBe(vm.hour)
    })
})

describe('TuaPage', () => {
    // test('deep watch', (done) => {
    //     const vm = TuaPage({
    //         data () {
    //             return { steve: 'young' }
    //         },
    //         computed: {
    //             steveLen () {
    //                 return this.steve.length
    //             },
    //         },
    //         watch: {
    //             'steve': {
    //                 deep: true,
    //                 handler (newVal) {
    //                     this.young = newVal
    //                 },
    //             },
    //             'steveLen': {
    //                 deep: true,
    //                 handler: 'onSteveLen',
    //             },
    //         },
    //         methods: {
    //             onSteveLen (newVal) {
    //                 this.youngLen = newVal
    //             },
    //         },
    //     })
    //     vm.steve = 'nash'
    //     expect(vm.young).toBe('young')
    //     expect(vm.youngLen).toBe(5)

    //     afterSetData(() => {
    //         expect(vm.young).toBe('nash')
    //         expect(vm.youngLen).toBe(4)
    //         done()
    //     })
    // })

    test('immediate watch', (done) => {
        const vm = TuaPage({
            data () {
                return {
                    steve: 'young',
                    a: { b: 'c' },
                }
            },
            computed: {
                steveLen () {
                    return this.steve.length
                },
            },
            watch: {
                'steve': {
                    immediate: true,
                    handler (newVal) {
                        this.young = newVal
                    },
                },
                'steveLen': {
                    immediate: true,
                    handler: 'onSteveLen',
                },
                'a.b': {
                    immediate: true,
                    handler: 'onAB',
                },
            },
            methods: {
                onAB (newVal) {
                    this.ab = newVal
                },
                onSteveLen (newVal) {
                    this.youngLen = newVal
                },
            },
        })
        vm.steve = 'nash'
        expect(vm.ab).toBe('c')
        expect(vm.young).toBe('young')
        expect(vm.youngLen).toBe(5)

        afterSetData(() => {
            expect(vm.young).toBe('nash')
            expect(vm.youngLen).toBe(4)
            done()
        })
    })

    test('watch string method name', (done) => {
        const vm = TuaPage({
            data () {
                return { steve: 'young' }
            },
            computed: {
                steveLen () {
                    return this.steve.length
                },
            },
            watch: {
                steve: 'onSteve',
                steveLen: 'onSteveLen',
            },
            methods: {
                onSteve (newVal) {
                    this.young = newVal
                },
                onSteveLen (newVal) {
                    this.youngLen = newVal
                },
            },
        })

        vm.steve = 'nash'

        afterSetData(() => {
            expect(vm.young).toBe('nash')
            expect(vm.youngLen).toBe(4)
            done()
        })
    })

    // close #37
    test('custom object data', () => {
        const customObj = { fn: x => x * 2 }
        const value = customObj.fn(1217)

        const vm = TuaPage({
            data () {
                return { customObj }
            },
            computed: {
                value () {
                    return this.customObj.fn(1217)
                },
            },
        })

        expect(value).toBe(vm.value)
    })

    test('use it just like MINA', (done) => {
        const vm = TuaPage({
            data: {
                nestedData: {
                    steve: 'steve',
                    young: {
                        young: 'young',
                    },
                },
                nestedArrayData: [
                    {
                        steve: 'steve',
                        young: {
                            young: 'young',
                        },
                    },
                ],
            },
            onUnload () {},
        })
        vm.nestedArrayData[0].young.young = 'hey man'

        afterSetData(() => {
            vm.onUnload()
            expect(vm.nestedArrayData[0].young.young).toBe('hey man')
            done()
        })
    })

    test('use it just like Vue', (done) => {
        const watchFn = jest.fn()
        const vm = TuaPage({
            data () {
                return {
                    nestedData: {
                        steve: 'steve',
                        young: {
                            young: 'young',
                        },
                    },
                    nestedArrayData: [
                        {
                            steve: 'steve',
                            young: {
                                young: 'young',
                            },
                        },
                    ],
                }
            },
            computed: {
                fullName () {
                    return this.nestedData.steve + this.nestedData.young.young
                },
            },
            watch: {
                'nestedArrayData[0].steve': watchFn,
            },
        })
        const newVal = 'StEve'

        vm.nestedArrayData[0].steve = newVal
        vm.nestedArrayData[0].steve = newVal
        vm.nestedArrayData[0].steve = newVal

        afterSetData(() => {
            expect(vm.nestedData).toEqual(vm.data.nestedData)
            expect(vm.nestedData).toEqual(vm.$data.nestedData)
            expect(vm.fullName).toEqual(vm.$computed.fullName)
            expect(vm.nestedArrayData[0].steve).toBe(newVal)
            expect(watchFn).toHaveBeenCalledTimes(1)
            expect(watchFn).toBeCalledWith(newVal, 'steve')
            done()
        })
    })

    test('edge case', () => {
        const onLoad = jest.fn()
        TuaPage({ onLoad })

        expect(onLoad).toBeCalled()
    })

    test('array item change should change computed', (done) => {
        let n = 0

        const vm = TuaPage({
            data () {
                return {
                    nestedArr: [
                        { num: n++ },
                    ],
                }
            },
            computed: {
                fromNestedArr () {
                    return this.nestedArr.filter(x => x.num > 1)
                },
            },
        })

        vm.nestedArr = [
            { num: n++ },
            { num: n++ },
        ]

        vm.nestedArr.push({ num: n++ })

        expect(vm.fromNestedArr.length).toBe(2)
        vm.nestedArr.forEach(x => x.num++)
        expect(vm.fromNestedArr.length).toBe(3)
        vm.nestedArr.forEach(x => x.num++)
        expect(vm.fromNestedArr.length).toBe(3)
        expect(vm.data.fromNestedArr.length).toBe(0)

        afterSetData(() => {
            expect(vm.fromNestedArr.length).toBe(3)
            done()
        })
    })
})

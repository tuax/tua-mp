import { afterSetData } from './utils'
import { TuaComp, TuaPage } from '../src'

const event = {
    "currentTarget": {
        "id": "",
        "offsetLeft": 0,
        "offsetTop": 0,
        "dataset": { "index": 0 }
    },
    "detail": { "value": [] }
}

const eventVal = { "value": [], "index": 0 }

const getTestForReservedKeys = (type) => {
    expect(() => type({ data: { $data: 'young' } })).toThrow()
    expect(() => type({ data: { __TUA_PATH__: 'path' } })).toThrow()
    expect(() => type({ computed: { $computed () { return '!' } } })).toThrow()
    expect(() => type({ methods: { $data () {} } })).toThrow()
}

describe('TuaComp', () => {
    test('component lifecycle', () => {
        let lifecycleArr = []

        const vm = TuaComp({
            data: { lc: 'a' },
            beforeCreate () {
                lifecycleArr.push('beforeCreate')
            },
            created () {
                lifecycleArr.push('created')
            },
            beforeMount () {
                lifecycleArr.push('beforeMount')
            },
            ready () {
                lifecycleArr.push('ready')
            },
            mounted () {
                lifecycleArr.push('mounted')
            },
            beforeUpdate () {
                lifecycleArr.push('beforeUpdate')
            },
            updated () {
                lifecycleArr.push('updated')
            },
            beforeDestroy () {
                lifecycleArr.push('beforeDestroy')
            },
            destroyed () {
                lifecycleArr.push('destroyed')
            },
        })

        expect(lifecycleArr).toEqual(['beforeCreate', 'created', 'beforeMount', 'ready', 'mounted'])

        lifecycleArr = []
        vm.lc = 'b'

        afterSetData(() => {
            expect(lifecycleArr).toEqual(['beforeUpdate', 'updated'])

            lifecycleArr = []
            vm.detached()
            expect(lifecycleArr).toEqual(['beforeDestroy', 'destroyed'])
        })
    })

    test('throw error when using reserved keys', () => getTestForReservedKeys(TuaComp))

    test('deep and immediate watch', (done) => {
        const vm = TuaComp({
            data () {
                return {
                    steve: 'young',
                    a: { b: { c: 'd' } },
                }
            },
            computed: {
                e () { return this.steve + this.a.b.c },
            },
            watch: {
                'a.b': {
                    deep: true,
                    immediate: true,
                    handler (newVal, oldVal) {
                        this.newAB = newVal
                        this.oldAB = oldVal
                    },
                },
                e: { immediate: true, handler: 'eFn' },
            },
            methods: {
                eFn (val) { this.newE = val },
            },
        })

        expect(vm.newE).toBe(vm.e)
        expect(vm.e).toBe(vm.steve + 'd')
        expect(vm.newAB).toEqual({ c: 'd' })
        expect(vm.oldAB).toEqual(undefined)
        vm.a.b.c = 'e'

        afterSetData(() => {
            expect(vm.e).toBe(vm.steve + 'e')
            expect(vm.newAB).toEqual({ c: 'e' })
            expect(vm.oldAB).toEqual({ c: 'd' })
            done()
        })
    })

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
            data: { compData: 'compData' },
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
        const vm = TuaComp({
            props: {
                propA: Number,
                propB: [String, Number],
                propC: { type: String, required: true },
                propD: { type: Number, default: 100 },
                propE: { type: Object, default: () => ({ message: 'hello' }) },
                propF: { validator: val => ['success', 'warning', 'danger'].indexOf(val) !== -1 },
            },
            computed: {
                dAndE () { return this.propD + this.propE.message },
            },
        })
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
            data () { return { now } },
            computed: {
                hour () { return this.now.getHours() },
            },
        })
        expect(hour).toBe(vm.hour)
    })
})

describe('TuaPage', () => {
    test('page lifecycle', () => {
        let lifecycleArr = []

        const vm = TuaPage({
            beforeCreate () {
                lifecycleArr.push('beforeCreate')
            },
            created () {
                lifecycleArr.push('created')
            },
            beforeMount () {
                lifecycleArr.push('beforeMount')
            },
            onReady () {
                lifecycleArr.push('onReady')
            },
            mounted () {
                lifecycleArr.push('mounted')
            },
            beforeDestroy () {
                lifecycleArr.push('beforeDestroy')
            },
            destroyed () {
                lifecycleArr.push('destroyed')
            },
        })

        expect(lifecycleArr).toEqual(['beforeCreate', 'created', 'beforeMount', 'onReady', 'mounted'])

        lifecycleArr = []
        vm.onUnload()

        expect(lifecycleArr).toEqual(['beforeDestroy', 'destroyed'])
    })

    test('throw error when using reserved keys', () => getTestForReservedKeys(TuaPage))

    test('array watch', (done) => {
        const vm = TuaPage({
            data () {
                return { a: { b: 'c' } }
            },
            watch: {
                a: [
                    {
                        deep: true,
                        handler (newVal, oldVal) {
                            this.newA = newVal
                            this.oldA = oldVal
                        },
                    },
                    {
                        immediate: true,
                        handler (newVal, oldVal) {
                            this.newIA = newVal
                            this.oldIA = oldVal
                        },
                    },
                    function (newVal, oldVal) {
                        this.newArrA = newVal
                        this.oldArrA = oldVal
                    },
                    { immediate: true, handler: 'aFn' },
                ],
            },
            methods: {
                aFn (newVal, oldVal) {
                    this.newAFn = newVal
                    this.oldAFn = oldVal
                },
            },
        })

        expect(vm.newA).toEqual(undefined)
        expect(vm.oldA).toEqual(undefined)
        expect(vm.newIA).toEqual({ b: 'c' })
        expect(vm.oldIA).toEqual(undefined)
        expect(vm.newArrA).toEqual(undefined)
        expect(vm.oldArrA).toEqual(undefined)
        expect(vm.newAFn).toEqual({ b: 'c' })
        expect(vm.oldAFn).toEqual(undefined)
        vm.a.b = 'd'

        afterSetData(() => {
            expect(vm.newA).toEqual({ b: 'd' })
            expect(vm.oldA).toEqual({ b: 'c' })
            expect(vm.newIA).toEqual({ b: 'd' })
            expect(vm.oldIA).toEqual(undefined)
            expect(vm.newArrA).toEqual(undefined)
            expect(vm.oldArrA).toEqual(undefined)
            expect(vm.newAFn).toEqual({ b: 'd' })
            expect(vm.oldAFn).toEqual(undefined)
            done()
        })
    })

    test('deep watch', (done) => {
        const vm = TuaPage({
            data () {
                return { a: { b: 'c' } }
            },
            watch: {
                a: {
                    deep: true,
                    handler (newVal, oldVal) {
                        this.newA = newVal
                        this.oldA = oldVal
                    },
                },
            },
        })

        vm.a.b = 'd'

        afterSetData(() => {
            expect(vm.newA).toEqual({ b: 'd' })
            expect(vm.oldA).toEqual({ b: 'c' })
            done()
        })
    })

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
            data () { return { customObj } },
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
                        young: { young: 'young' },
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
                        young: { young: 'young' },
                    },
                    nestedArrayData: [
                        {
                            steve: 'steve',
                            young: { young: 'young' },
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
                    nestedArr: [ { num: n++ } ],
                }
            },
            computed: {
                fromNestedArr () {
                    return this.nestedArr.filter(x => x.num > 1)
                },
            },
        })

        vm.nestedArr = [ { num: n++ }, { num: n++ } ]
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

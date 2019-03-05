import { afterSetData } from './utils'
import { TuaComp } from '../../src/'

const event = {
    'currentTarget': {
        'id': '',
        'offsetLeft': 0,
        'offsetTop': 0,
        'dataset': { 'index': 0 },
    },
    'detail': { 'value': [] },
}

const eventVal = { 'value': [], 'index': 0 }

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
            expect(vm.oldAB).toEqual({ c: 'e' })
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

    // close #62
    test('created/onLoad observer', () => {
        const vm = TuaComp({
            props: {
                someProp: {
                    type: String,
                    default: 'default',
                },
            },
        })
        vm.$props.someProp.observer.call(vm, 'observer')

        expect(vm.someProp).toBe('observer')
    })
})

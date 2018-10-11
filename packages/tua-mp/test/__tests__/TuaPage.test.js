import { TuaPage } from '../../src/'
import { afterSetData } from './utils'

const getTestForReservedKeys = (type) => {
    expect(() => type({ data: { $data: 'young' } })).toThrow()
    expect(() => type({ data: { __TUA_PATH__: 'path' } })).toThrow()
    expect(() => type({ computed: { $computed () { return '!' } } })).toThrow()
    expect(() => type({ methods: { $data () {} } })).toThrow()
}

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
                return {
                    a: { b: 'c' },
                    arr: [{ d: { e: 'f' } }, { d: { e: 'ff' } }],
                }
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
            expect(vm.oldA).toEqual({ b: 'd' })
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
                return {
                    a: { b: 'c' },
                    arr: [{ d: { e: 'f' } }, { d: { e: 'ff' } }],
                }
            },
            watch: {
                a: {
                    deep: true,
                    handler (newVal, oldVal) {
                        this.newA = newVal
                        this.oldA = oldVal
                    },
                },
                arr: {
                    deep: true,
                    handler (newVal, oldVal) {
                        this.newArr = newVal
                        this.oldArr = oldVal
                    },
                },
            },
        })

        vm.a.b = 'd'
        vm.arr[0].d.e = 'g'
        vm.arr[1].d.e = 'gg'

        afterSetData(() => {
            expect(vm.newA).toEqual({ b: 'd' })
            expect(vm.oldA).toEqual({ b: 'd' })
            expect(vm.newArr[0].d).toEqual({ e: 'g' })
            expect(vm.newArr[1].d).toEqual({ e: 'gg' })
            expect(vm.oldArr[0].d).toEqual({ e: 'g' })
            expect(vm.oldArr[1].d).toEqual({ e: 'gg' })
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
                    handler (newVal, oldVal) {
                        this.oldYoung = oldVal
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
        expect(vm.oldYoung).toBe(undefined)
        expect(vm.young).toBe('young')
        expect(vm.youngLen).toBe(5)

        afterSetData(() => {
            expect(vm.oldYoung).toBe('young')
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
        const watchFn = jest.fn(function () {
            this.nestedData.steve = 'from watch'
        })
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
                    strArr: ['a', 'b'],
                    nestedArr: [ { num: n++, e: [{ v: { e: 'e' } }] } ],
                }
            },
            computed: {
                stringifyNA () {
                    return JSON.stringify(this.fromNestedArr)
                },
                fromNestedArr () {
                    return this.nestedArr.filter(x => x.num > 1)
                },
                firstStr () {
                    return this.strArr[0]
                },
            },
        })

        vm.strArr = ['c']
        vm.nestedArr = [ { num: n++ }, { num: n++ } ]
        vm.nestedArr.push({ num: n++, s: { t: 't' } })

        expect(vm.fromNestedArr.length).toBe(2)

        vm.nestedArr.forEach(x => x.num++)
        expect(vm.fromNestedArr.length).toBe(3)

        vm.nestedArr.forEach(x => x.num++)
        expect(vm.fromNestedArr.length).toBe(3)
        expect(vm.data.fromNestedArr.length).toBe(0)

        afterSetData(() => {
            expect(vm.nestedArr[2].s.__dep__.subs.length)
                .toEqual(vm.nestedArr.__dep__.subs.length)

            expect(vm.firstStr).toBe('c')
            expect(vm.fromNestedArr.length).toBe(3)
            expect(vm.nestedArr.__dep__.subs.length)
                .toEqual(vm.nestedArr[0].__dep__.subs.length)
            done()
        })
    })
})

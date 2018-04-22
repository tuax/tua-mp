import { TuaPage } from '../src'
import { afterSetData } from './utils'

describe('TuaPage', () => {
    afterEach(() => {
    })

    test('use it just like MP', (done) => {
        const onLoad = jest.fn(() => {})
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
            onLoad,
        })

        vm.nestedArrayData[0].young.young = 'hey man'

        afterSetData(() => {
            expect(vm.nestedArrayData[0].young.young).toBe('hey man')

            done()
        })
    })

    test('use it just like Vue', (done) => {
        const watchFn = jest.fn(() => {})
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
})

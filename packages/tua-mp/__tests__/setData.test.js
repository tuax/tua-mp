import { afterSetData } from './utils'
import { TuaComp, TuaPage } from '../src'

describe('TuaComp', () => {
    afterEach(() => {})

    test('nested setData with callback', (done) => {
        const vm = TuaComp({
            data: {
                a: { b: 'c' },
                young: 'young',
            },
            computed: {
                sAndY: vm => vm.a.b + vm.young,
            },
        })

        vm.setData({ 'a.b': 'steve' }, () => {
            expect(vm.a.b).toBe('steve')
        })

        afterSetData(() => {
            expect(vm.sAndY).toBe('steveyoung')
            done()
        })
    })
})

describe('TuaPage', () => {
    afterEach(() => {})

    test('nested setData with callback', (done) => {
        const vm = TuaPage({
            data: {
                a: { b: 'c' },
                young: 'young',
            },
            computed: {
                sAndY: vm => vm.a.b + vm.young,
            },
        })

        vm.setData({ 'a.b': 'steve' }, () => {
            expect(vm.a.b).toBe('steve')
        })

        afterSetData(() => {
            expect(vm.sAndY).toBe('steveyoung')
            done()
        })
    })
})

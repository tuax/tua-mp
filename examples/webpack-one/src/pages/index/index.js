// index.js
import { TuaPage } from 'tua-mp'
import { log } from '@/utils'

let n = 0

TuaPage({
    data () {
        return {
            msg: 'msg',
            a: {
                b: 'a.b',
            },
            arr: [
                { c: { d: 'd0' } },
                { c: { d: 'd1' } },
                1, 2, 3,
            ],
            g: 'hello world',

            // 测试所需数据
            testData: {
                nested: {
                    steve: 'steve',
                    young: {
                        young: 'young',
                    },
                },
                arr: [],
                nestedArr: [
                    {
                        name: 'steve',
                        nick: {
                            young: 'young',
                        },
                    },
                    {
                        name: 'jame',
                    },
                ],
                insertNestedArr: [],
            },
        }
    },
    onLoad () {
        log(this)
        global = this

        for (let i = 100; i > 90; i--) {
            this.g = i
            this['g'] = i + 1
        }
    },
    computed: {
        reversedG () {
            return this.reverseStr(this.g)
        },
        gAndAB () {
            return this.g + ' + ' + this.a.b
        },
        dataAndComputed() {
            return this.g + ' + ' + this.reversedG
        },
    },
    watch: {
        msg (newVal, oldVal) {
            log(`msg: ${oldVal} -> ${newVal}`)
        },
        'a.b' (newVal, oldVal) {
            log(`a.b: ${oldVal} -> ${newVal}`)
            setTimeout(() => {
                this.msg = this.reverseStr(this.msg)
            }, 1000)
        },
        'g' (newVal, oldVal) {
            log(`g: ${oldVal} -> ${newVal}`)
        },
        'reversedG' (newVal, oldVal) {
            log(`reversedG: ${oldVal} -> ${newVal}`)
        },
        'gAndAB' (newVal, oldVal) {
            log(`gAndAB: ${oldVal} -> ${newVal}`)
        },
    },
    methods: {
        tapMsg () {
            this.msg += n++
        },
        tapAB () {
            this.a.b += n++
        },
        tapArr () {
            this.arr.push(n++)
        },
        tapArrNest0 () {
            this.arr[0].c.d = n++
        },
        tapArrNest1 () {
            this.arr[1].c.d = n++
        },
        tapArrSp () {
            this.arr.splice(2, 2, n++)
        },
        tapReverseG () {
            this.g = this.reversedG
        },
        reverseStr (str) {
            return String(str).split('').reverse().join('')
        },
        unshiftNested () {
            this.arr.unshift({ c: { d: 'hey' } })
        },
    },
})

// index.js
import { TuaPage } from '../../utils/index'
import {
    testArrayData,
    testSimpleData,
    testNestedData,
    testNestedArrayData,
} from '../../test/data'

let n = 0

TuaPage({
    data () {
        return {
            msg: 'msg',
            a: {
                b: 'a.b',
            },
            arr: [
                { c: { d: 'd' } },
                1, 2, 3,
            ],
            g: 'hello world',

            nestedData: {
                steve: 'steve',
                young: {
                    young: 'young',
                },
            },
            arrayData: [],
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
    onLoad () {
        console.log(this)
        global = this

        for (let i = 100; i > 90; i--) {
            this.g = i
        }

        // feature test
        testArrayData(this)
        testSimpleData(this)
        testNestedData(this)
        testNestedArrayData(this)
    },
    computed: {
        reversedG () {
            return this.reverseStr(this.g)
        },
        gAndAB () {
            return this.g + ' + ' + this.a.b
        },
    },
    watch: {
        msg (newVal, oldVal) {
            console.log('newVal', newVal)
            console.log('oldVal', oldVal)
        },
        'a.b' (newVal, oldVal) {
            setTimeout(() => {
                this.msg = this.reverseStr(this.msg)
            }, 1000)
        },
        'reversedG' (newVal, oldVal) {
            console.log('newVal', newVal)
            console.log('oldVal', oldVal)
        },
    },
    methods: {
        tapMsg () {
            this.msg = 'msg' + n++
        },
        tapAB () {
            this.a.b = 'a.b' + n++
        },
        tapArr () {
            this.arr.push(n++)
        },
        tapArrNest () {
            this.arr[0].c.d = n++
        },
        tapArrSp () {
            this.arr.splice(1, 1, n++)
        },
        tapReverseG () {
            this.g = this.reversedG

            // 对于 computed 属性赋值不起作用
            this.reversedG = 'aaa'
        },
        reverseStr (str) {
            return String(str).split('').reverse().join('')
        },
    },
})

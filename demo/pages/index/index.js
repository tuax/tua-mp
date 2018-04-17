//index.js
import { TuaWxPage } from '../../utils/index'

let n = 0

TuaWxPage({
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
        }
    },
    onLoad () {
        console.log('onLoad')
        console.log(this)
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
            setTimeout(() => {
                this.a.b = 'reversedG'
            }, 1000)
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

            this.reversedG = 'aaa'
        },
        reverseStr (str) {
            return str.split('').reverse().join('')
        },
    },
})

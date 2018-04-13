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
            return this.g.split('').reverse().join('')
        },
        gAndAB () {
            return this.g + ' + ' + this.a.b
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
    },
})

import { TuaPage } from '../../utils/tua-mp'
import {
    testArrayData,
    testSimpleData,
    testNestedData,
    testNestedArrayData,
    testInsertNestedArrayData,
} from '../../test/feature'

let n = 0

const watchLog = (prefix) => (newVal, oldVal) => console.log(`${prefix}: ${oldVal} -> ${newVal}`)

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

    // 兼容 Vue 的生命周期方法
    created () {
        console.log(this)
        global = this

        for (let i = 100; i > 90; i--) {
            this.g = i
            this['g'] = i + 1
        }

        // feature test
        testArrayData(this)
        testSimpleData(this)
        testNestedData(this)
        testNestedArrayData(this)
        testInsertNestedArrayData(this)
    },

    // 在 setData 前调用
    beforeUpdate () {
        console.log('beforeUpdate')
        this.stringifyLog(this.data)
    },

    // 在 setData 第二个参数中调用（渲染完毕的回调）
    updated () {
        console.log('updated')
        this.stringifyLog(this.data)
    },

    computed: {
        reversedG () {
            return this.reverseStr(this.g)
        },
        gAndAB () {
            return this.g + ' + ' + this.a.b
        },
        dataAndComputed () {
            return this.g + ' + ' + this.reversedG
        },
    },

    watch: {
        msg (newVal, oldVal) {
            console.log(`msg: ${oldVal} -> ${newVal}`)
        },
        'a.b' (newVal, oldVal) {
            console.log(`a.b: ${oldVal} -> ${newVal}`)
            setTimeout(() => {
                this.msg = this.reverseStr(this.msg)
            }, 1000)
        },
        // 数组
        'g': [
            watchLog('g'),
        ],
        // immediate
        'reversedG': {
            immediate: true,
            // 直接填写 methods 名称
            handler: 'logFromMethods',
        },
        'gAndAB' (newVal, oldVal) {
            console.log(`gAndAB: ${oldVal} -> ${newVal}`)
        },
        // deep
        arr: [
            watchLog('arr'),
            {
                deep: true,
                immediate: true,
                handler: 'stringifyLog',
            },
        ],
    },

    methods: {
        logFromMethods (newVal, oldVal) {
            console.log(`logFromMethods: ${oldVal} -> ${newVal}`)
        },
        stringifyLog (newVal) {
            console.log(`stringifyLog: ${JSON.stringify(newVal, null, 4)}`)
        },
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
        gotoLogs () {
            wx.navigateTo({ url: '/pages/logs/logs' })
        },
    },
})

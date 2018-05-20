<config>
{
  "navigationBarTitleText": "点击空白处跳转"
}
</config>

<wxml>
    <view class="container" catchtap="gotoLogs">
        <view class="box">msg: {{ msg }}</view>
        <button type="primary" size="mini" catchtap="tapMsg">
            this.msg += n++
        </button>

        <view>a.b: {{ a.b }}</view>
        <button type="primary" size="mini" catchtap="tapAB">
            this.a.b += n++
        </button>

        <view>arr: {{ arr }}</view>
        <button type="primary" size="mini" catchtap="tapArr">
            this.arr.push(n++)
        </button>
        <button type="primary" size="mini" catchtap="unshiftNested">
            this.arr.unshift({ c: { d: 'hey' } })
        </button>

        <view>arr[0].c.d: {{ arr[0].c.d }}</view>
        <button type="primary" size="mini" catchtap="tapArrNest0">
            this.arr[0].c.d = n++
        </button>

        <view>arr[1].c.d: {{ arr[1].c.d }}</view>
        <button type="primary" size="mini" catchtap="tapArrNest1">
            this.arr[1].c.d = n++
        </button>

        <view>arr[1]: {{ arr[1] }}</view>
        <button type="primary" size="mini" catchtap="tapArrSp">
            this.arr.splice(2, 2, n++)
        </button>

        <view>------ computed ------</view>
        <view>g: {{ g }}</view>
        <view>reversedG: {{ reversedG }}</view>
        <button type="primary" size="mini" catchtap="tapReverseG">
            this.g = this.reversedG
        </button>

        <view>a.b: {{ a.b }}</view>
        <view>gAndAB: {{ gAndAB }}</view>
        <view>dataAndComputed: {{ dataAndComputed }}</view>
        <button type="primary" size="mini" catchtap="tapAB">
            this.a.b = 'a.b' + n++
        </button>
    </view>
</wxml>

<script>
import { log } from '@utils'

let n = 0

export default {
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
        /* eslint-disable no-global-assign */
        global = this
        /* eslint-enable no-global-assign */

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
        dataAndComputed () {
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
        gotoLogs () {
            wx.navigateTo({ url: '/pages/logs/logs' })
        },
    },
}
</script>

<style lang="less">
@base: #f938ab;

.box-shadow(@style, @c) when (iscolor(@c)) {
  -webkit-box-shadow: @style @c;
  box-shadow:         @style @c;
}
.box-shadow(@style, @alpha: 50%) when (isnumber(@alpha)) {
  .box-shadow(@style, rgba(0, 0, 0, @alpha));
}
.box {
  color: saturate(@base, 5%);
  border-color: lighten(@base, 30%);
  .box-item { .box-shadow(0 0 5px, 30%) }
}
</style>

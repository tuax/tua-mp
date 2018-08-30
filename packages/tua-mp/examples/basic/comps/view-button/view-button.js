// comps/view-button.js
import { TuaComp } from '../../utils/tua-mp'

TuaComp({
    /**
     * 组件的属性列表
     */
    props: {
        // Vue 风格的 prop 写法
        methodContent: {
            type: String,
            // 并没有什么用，因为小程序组件没这概念
            required: true,
            // 强行让不含 msg 的内容告警
            validator: val => val.indexOf('msg') !== -1,
        }
    },

    /**
     * 和 Vue 一样的组件初始数据
     */
    data () {
        return {

        }
    },

    created () {
        console.log('[view-button]: created')
    },

    mounted () {
        console.log('[view-button]: mounted')
    },

    beforeUpdate () {
        console.log('[view-button]: beforeUpdate')
    },

    updated () {
        console.log('[view-button]: updated')
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTap(e) {
            // 使用 $emit 替换原本的 triggerEvent
            this.$emit('onTap', e)
        },
    }
})

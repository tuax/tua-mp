<config>
{
    "component": true
}
</config>

<template lang="wxml">
    <view>propA: {{ propA }}</view>
    <view>propB: {{ propB }}</view>
    <view>propAB: {{ propAB }}</view>
    <view>aAndB: {{ aAndB }}</view>

    <view class="box">a: {{ a }}</view>
    <button type="primary" size="mini" catchtap="addA">
        this.a += n++
    </button>

    <view class="box">b: {{ b }}</view>
    <button type="primary" size="mini" catchtap="addB">
        this.b += n++
    </button>
</template>

<script>
let n = 0

export default {
    props: {
        propA: {
            type: String,
        },
        propB: {
            type: String,
        },
    },
    data () {
        return {
            a: 'a',
            b: 'b',
        }
    },
    // TODO
    computed: {
        propAB () {
            return this.propA + this.propB
        },
        aAndB () {
            return this.a + this.b
        },
    },
    watch: {
        propA (newVal, oldVal) {
            console.log(`propA: ${oldVal} -> ${newVal}`)
        },
        propB (newVal, oldVal) {
            console.log(`propB: ${oldVal} -> ${newVal}`)
        },
        propAB (newVal, oldVal) {
            console.log(`propAB: ${oldVal} -> ${newVal}`)
        },
        aAndB (newVal, oldVal) {
            console.log(`aAndB: ${oldVal} -> ${newVal}`)
        },
    },
    methods: {
        addA () {
            this.a += n++
        },
        addB () {
            this.b += n++
        },
    },
    attached () {
        console.log('this', this)
        console.log('this.data', this.data)
    },
}
</script>

<style lang="scss">
.li {
    display: inline-block;

    .a {
        display: inline;

        margin: 3px;
        padding: 6rpx 10rpx;

        text-decoration: none;

        color: inherit;
        border: 1px solid transparent;
        border-radius: 3px;

        &:hover {
            border-color: rgba(175, 47, 47, 0.1);
        }

        &.selected {
            border-color: rgba(175, 47, 47, 0.2);
        }
    }
}

</style>

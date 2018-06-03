<config>
{
    "component": true
}
</config>

<template lang="wxml">
    <view class="li">
        <view
            class="a {{ visibility === filterType ? 'selected' : '' }}"
            data-filter="{{ filterType }}"
            bindtap="onChangeFilter"
        >
            {{ filterType }}
        </view>
    </view>
</template>

<script>
import { VALID_FILTERS } from '@const'

export default {
    props: {
        visibility: {
            type: String,
            validator: val => VALID_FILTERS.includes(val),
        },
        filterType: {
            type: String,
            validator: val => VALID_FILTERS.includes(val),
        },
    },
    data () {
        return {
            visibility: 'test',
            v: 'test',
        }
    },
    computed: {
        computedVal () {
            return this.visibility + this.filterType
        },
    },
    methods: {
        onChangeFilter (e) {
            this.$emit('onChangeFilter', e)
        },
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

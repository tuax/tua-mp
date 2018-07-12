<config>
{
  "navigationBarTitleText": "查看启动日志"
}
</config>

<template lang="wxml">
    <!--logs.wxml-->
    <view class="container log-list">
        <image src="/assets/vue-logo.png" />

        <block
            wx:for="{{ logs }}"
            wx:for-item="log"
            wx:key="*this"
        >
            <text class="log-item">
                {{ index + 1 }}. {{ log }}
            </text>
        </block>
    </view>
</template>

<script>
import { formatTime } from '@utils'

const { globalData: { storage } } = getApp()

export default {
    data () {
        return {
            logs: [],
        }
    },
    async created () {
        const { data } = await storage.load({ key: 'logs' })

        this.logs = data
            .map(log => new Date(log))
            .map(formatTime)
    },
}
</script>

<style lang="scss">
.log-list {
    display: flex;
    flex-direction: column;

    padding: 40rpx;

    .log-item {
        margin: 10rpx;
    }
}
</style>

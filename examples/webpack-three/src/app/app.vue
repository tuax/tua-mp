
<script>
import '@/styles/global.styl'

export default {
    onLaunch () {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        const p = new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })

        p.then(() => {
            console.log('from promise')
        })

        const set = new Set([1, 2, 2, 3, 4, 5, 5, 5])
        const arr = Array.from(set)

        console.log(arr.includes(1))
    },
    globalData: {},
}
</script>

<style lang="scss">
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    font-size: 14px;
}
</style>

// logs.js
import { TuaPage } from '../../utils/tua-mp'
import { formatTime } from '../../utils/index'

TuaPage({
    data: {
        logs: [],
    },
    onLoad () {
        const logs = wx.getStorageSync('logs') || []

        this.logs = logs
            .map(log => new Date(log))
            .map(formatTime)
    },
})

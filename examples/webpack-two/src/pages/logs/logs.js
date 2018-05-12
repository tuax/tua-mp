// logs.js
import { TuaPage } from 'tua-mp'
import { formatTime } from '@utils'

import './logs.scss'

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

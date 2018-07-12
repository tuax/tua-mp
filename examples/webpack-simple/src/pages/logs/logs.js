// logs.js
import { TuaPage } from 'tua-mp'
import { formatTime } from '@utils'

import './logs.scss'

const { globalData: { storage } } = getApp()

TuaPage({
    data: {
        logs: [],
    },
    async created () {
        const { data } = await storage.load({ key: 'logs' })

        this.logs = data
            .map(log => new Date(log))
            .map(formatTime)
    },
})

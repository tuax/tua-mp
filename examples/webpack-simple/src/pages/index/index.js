import { TuaPage } from 'tua-mp'

import './index.less'

// 获取应用实例
const app = getApp()

TuaPage({
    data () {
        return {
            userInfo: {},
            hasUserInfo: false,
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
        }
    },
    onLoad () {
        this.gotoTodos()

        if (app.globalData.userInfo) {
            this.userInfo = app.globalData.userInfo
            this.hasUserInfo = true
        } else if (this.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = ({ userInfo }) => {
                console.log('userInfo', userInfo)
                this.userInfo = userInfo
                this.hasUserInfo = true
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: ({ userInfo }) => {
                    app.globalData.userInfo = userInfo

                    this.userInfo = userInfo
                    this.hasUserInfo = true
                },
            })
        }
    },
    methods: {
        // 事件处理函数
        bindViewTap () {
            wx.navigateTo({
                url: '../logs/logs',
            })
        },
        gotoTodos () {
            wx.navigateTo({
                url: '/pages/todos/todos',
            })
        },
        getUserInfo (e) {
            console.log(e)
            app.globalData.userInfo = e.detail.userInfo

            this.userInfo = e.detail.userInfo
            this.hasUserInfo = true
        },
    },
})

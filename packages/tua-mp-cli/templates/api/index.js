import TuaApi from 'tua-api'

// 初始化
const tuaApi = new TuaApi({ reqType: 'wx' })

// 使用中间件
tuaApi.use(async (ctx, next) => {
    // 请求发起前
    // console.log('before: ', ctx)

    await next()

    // 响应返回后
    // console.log('after: ', ctx)
})

// 导出接口

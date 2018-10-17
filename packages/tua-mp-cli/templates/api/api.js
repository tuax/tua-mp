
/**
 * 详细配置请参阅 https://tuateam.github.io/tua-api/config/
 */
export default {
    // 该参数表示请求的公用服务器地址。
    host: 'https://example-base.com/',

    // 该参数表示请求的中间路径，建议与文件同名，以便后期维护。
    prefix: '{{ name }}',

    // 所有请求类型（可选值 OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT）
    type: 'get',

    // 所有请求都需要携带的参数，例如小程序中的所有接口都要携带以下参数 `from=miniprogram`
    commonParams: { from: 'miniprogram' },

    // 是否使用在 index.js 中定义的全局中间件，默认为 true
    useGlobalMiddleware: true,

    // 所有请求发起时是否自动展示 loading（默认为 true）
    isShowLoading: true,

    // 小程序中展示 loading 的方法
    showLoadingFn: wx.showNavigationBarLoading,

    // 小程序中隐藏 loading 的方法
    hideLoadingFn: wx.hideNavigationBarLoading,

    // 中间件函数数组
    middleware: [],

    // 接口地址数组
    pathList: [
        /**
         * example-path
         */
        {
            path: 'example-path',
            params: {},
        },
    ],
}


/**
 * https://tuateam.github.io/tua-api/config/
 */
export default {
    // 该参数表示请求的公用服务器地址。
    host: 'http://example-base.com/',

    // 该参数表示请求的中间路径，建议与文件同名，以便后期维护。
    prefix: '{{ name }}',

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

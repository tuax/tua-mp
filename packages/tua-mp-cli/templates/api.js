import { getReqPromiseByApiConfig } from '@tencent/tua-api-wx'

import { showError } from '@utils'
import { BASE_SERVER } from '@const'

const apiConfig = {
    // 该参数表示请求的公用服务器地址。
    host: BASE_SERVER,
    // 该参数表示请求的中间路径，建议与文件同名，以便后期维护。
    prefix: '{{ name }}',
    // 所有请求都需要携带的参数，例如小程序中的所有接口都要携带以下参数 `from=miniprogram`
    commonParams: { from: 'miniprogram' },
    // 该参数透传 `fetch-jsonp` 需要配置的参数。例如需要传递超时时间时可添加：
    jsonpOptions: { timeout: 10 * 1000 },
    // 该参数透传 `axios` 需要配置的参数。例如需要传递超时时间时可添加：
    axiosOptions: { timeout: 10 * 1000 },
    // 展示错误
    afterFn: showError,
    pathList: [
        /**
         * example-api
         */
        {
            // 接口最后的路径名称
            path: 'example-api',
            // params 也可以是数组，但是推荐使用如下所示的对象的形式
            // 这样就可以填写默认值，标记是否必传
            params: {
                param1: 1217,
                param2: 'steve',
                // isRequired 或者 required 都行
                param3: { required: true },
            },
            // 在这里的 Promise 返回的 params 会和请求的 params 合并
            // 适用于异步获取通用参数的场景
            beforeFn: () => Promise.resolve({
                params: { asyncCp: 'asyncCp' },
            }),
        },
    ],
}

export default getReqPromiseByApiConfig(apiConfig)

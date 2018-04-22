/* global Page */

import { version } from '../package.json'
import { isFn } from './utils'
import {
    bindData,
    bindComputed,
    getObserveDeep,
    getAsyncSetData,
} from './observe'

console.log(`Tua-Mp Version: ${version}`)

/**
 * 适配 Vue 风格代码，使其支持在小程序中运行（告别不方便的 setData）
 * @param {Object} args Page 参数
 */
export const TuaPage = (args) => {
    const {
        data: rawData,
        watch = {},
        methods = {},
        computed = {},
        ...rest
    } = args

    const data = isFn(rawData) ? rawData() : rawData

    return Page({
        ...rest,
        ...methods,
        data,
        onLoad (...options) {
            const asyncSetData = getAsyncSetData(this, watch)
            const observeDeep = getObserveDeep(asyncSetData)

            // 遍历递归观察 data
            bindData(this, observeDeep)

            // 遍历观察 computed
            bindComputed(this, computed, watch)

            rest.onLoad && rest.onLoad.apply(this, options)
        },
    })
}

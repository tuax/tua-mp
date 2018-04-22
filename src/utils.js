// constants
export const COMMON_PROP = {
    enumerable: true,
    configurable: true,
}

export const isFn = fn => typeof fn === 'function'

/**
 * 将 source 上的属性代理到 target 上
 * @param {Object} source 被代理对象
 * @param {Object} target 被代理目标
 */
export const proxyData = (source, target) => {
    Object.keys(source).forEach((key) => {
        Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
        )
    })
}

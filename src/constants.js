// 小程序内部属性的判断正则
export const innerAttrRe = /^__.*__$/

// Vue 还多支持了 Function 和 Symbol 类型
export const TYPES = [String, Number, Boolean, Object, Array, null]

export const COMMON_PROP = {
    enumerable: true,
    configurable: true,
}

export const _toString = Object.prototype.toString

// 每个对象上挂载自己路径前缀的 key
export const __TUA_PATH__ = '__TUA_PATH__'

// 每个对象上挂载自己的依赖对象
export const __dep__ = '__dep__'

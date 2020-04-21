import {
    __dep__,
    _toString,
    innerAttrRe,
    reservedKeys,
    __TUA_PATH__,
} from '../constants'
import { logger } from './logger'

export const isFn = fn => typeof fn === 'function'

export const hasProtoInObj = obj => '__proto__' in obj

export const isNotInnerAttr = key => !innerAttrRe.test(key)

export const toRawType = value =>
    _toString.call(value).slice(8, -1)

export const isPlainObject = value =>
    _toString.call(value) === '[object Object]'

// 根据路径前缀和 key 得到当前路径
export const getPathByPrefix = (prefix, key) => prefix === ''
    ? key
    : `${prefix}.${key}`

export const jsonParse = JSON.parse.bind(JSON)
export const stringify = JSON.stringify.bind(JSON)

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

/**
 * 将对象属性路径字符串转换成路径数组
 * @param {String} str
 * @returns {Array}
 */
export const pathStr2Arr = (str) => str
    .split('.')
    .map(x => x
        .split(/\[(.*?)\]/)
        .filter(x => x)
    )
    .reduce((acc, cur) => acc.concat(cur), [])

/**
 * 根据 path 获取目标对象 obj 上的值
 * @param {Object} obj 目标对象
 * @param {String} path 路径字符串
 * @returns {Any} obj
 */
export const getValByPath = (obj) => (path) => pathStr2Arr(path)
    .reduce((acc, cur) => acc[cur], obj)

/**
 * 根据 path 将目标值 val 设置到目标对象 obj 上
 * @param {Object} obj 目标对象
 * @param {String} path 路径字符串
 * @param {any} val 目标值
 * @param {Boolean} isCheckDef 是否检查属性已定义
 */
export const setObjByPath = ({ obj, path, val, isCheckDef = false }) => pathStr2Arr(path)
    .reduce((acc, cur, idx, arr) => {
        // 在调用 setData 时，有的属性可能没定义
        if (isCheckDef && acc[cur] === undefined) {
            const parentStr = arr
                .slice(0, idx)
                .reduce(
                    (acc, cur) => /\d/.test(cur)
                        ? `${acc}[${cur}]`
                        : `${acc}.${cur}`,
                    'this'
                )

            logger.error(
                `Property "${cur}" is not found in "${parentStr}": ` +
                'Make sure that this property has initialized in the data option.'
            )
        }

        if (idx === arr.length - 1) {
            acc[cur] = val
            return
        }

        // 当前中间属性在目标对象上并不存在
        if (!acc[cur]) {
            acc[cur] = /\d/.test(cur) ? [] : {}
        }

        return acc[cur]
    }, obj)

/**
 * 使用函数的名称字符串来检查内置的类型
 * 因为简单的相等检查，在不同的 vms 或 iframes 中运行时会判断错误
 */
export const getType = (fn) => {
    const match = fn && fn
        .toString()
        .match(/^\s*function (\w+)/)

    return match ? match[1] : ''
}

/**
 * 断言值的类型是否匹配
 * @param {any} value 值
 * @param {Function} type 类型函数
 */
export const assertType = (value, type) => {
    let valid
    const expectedType = getType(type)

    if (/(String|Number|Boolean)/.test(expectedType)) {
        const t = typeof value
        valid = t === expectedType.toLowerCase()

        // 例如 new Number(1)
        if (!valid && t === 'object') {
            valid = value instanceof type
        }
    } else if (expectedType === 'Object') {
        valid = isPlainObject(value)
    } else if (expectedType === 'Array') {
        valid = Array.isArray(value)
    } else {
        valid = value instanceof type
    }

    return { valid, expectedType }
}

// reserved keys
const isReservedKeys = str => reservedKeys.indexOf(str) !== -1
const getObjHasReservedKeys = obj => Object.keys(obj).filter(isReservedKeys)

// 检查在 data、computed、methods 中是否使用了保留字
export const checkReservedKeys = (data, computed, methods) => {
    const reservedKeysInVm = getObjHasReservedKeys(data)
        .concat(getObjHasReservedKeys(computed))
        .concat(getObjHasReservedKeys(methods))
        .join(', ')

    if (reservedKeysInVm) {
        throw Error(
            '请勿在 data、computed、methods ' +
            `中使用下列保留字:\n ${reservedKeysInVm}`
        )
    }
}

/**
 * 在对象上定义属性
 * @param {String} key 属性名
 * @param {any} value 值
 * @param {Object} target 对象
 */
export const def = (key) => ({
    value,
    enumerable = false,
    configurable = true,
    ...rest
}) => (target) => {
    Object.defineProperty(target, key, {
        value,
        enumerable,
        configurable,
        ...rest,
    })
}
export const defDep = def(__dep__)
export const defTuaPath = def(__TUA_PATH__)

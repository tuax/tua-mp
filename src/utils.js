import {
    _toString,
    innerAttrRe,
} from './constants'

export const warn = msg => console.warn(`[TUA-MP warn]: ${msg}`)

export const isFn = fn => typeof fn === 'function'

export const hasProtoInObj = obj => '__proto__' in obj

export const isNotInnerAttr = key => !innerAttrRe.test(key)

export const toRawType = value =>
    _toString.call(value).slice(8, -1)

export const isPlainObject = value =>
    _toString.call(value) === '[object Object]'

// 根据路径前缀和 key 得到当前路径
export const getPathByPrefix = (prefix, key) =>
    prefix === '' ? key : `${prefix}.${key}`

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
 * 根据 path 将目标值 val 设置到目标对象 obj 上
 * @param {Object} obj 目标对象
 * @param {String} path 路径字符串
 * @param {any} val 目标值
 * @returns {Object} obj
 */
export const setObjByPath = ({ obj, path, val }) => pathStr2Arr(path)
    .reduce((acc, cur, idx, { length }) => {
        if (idx === length - 1) {
            acc[cur] = val
            return
        }

        // 当前属性在目标对象上并不存在
        if (!acc[cur]) {
            acc[cur] = /\d/.test(cur) ? [] : {}
        }

        return acc[cur]
    }, obj)

/**
 * 将 Vue 风格的 props 改写成小程序原生的 properties
 * @param {Array|Object} props
 */
export const getPropertiesFromProps = (props) => {
    // 输入数组则转译成接受任意数据类型的 null
    if (Array.isArray(props)) {
        return props.map(prop => ({ [prop]: null }))
    }

    return Object.keys(props)
        .map((name) => {
            const prop = props[name]

            // 基本类型的直接返回
            if (TYPES.indexOf(prop) !== -1) {
                return { [name]: prop }
            }

            // 测试了下不支持直接简写或 type 是数组
            // 只能手动检查了
            if (Array.isArray(prop)) {
                return {
                    [name]: {
                        type: null,
                        observer (value) {
                            assertProp({
                                prop: { type: prop },
                                name,
                                value,
                            })
                        },
                    },
                }
            }

            // 对象形式的 prop
            return {
                [name]: {
                    type: prop.type || null,
                    value: isFn(prop.default)
                        ? prop.default()
                        : prop.default,
                    observer (value) {
                        assertProp({ prop, name, value })

                        const {
                            validator = () => true,
                        } = prop

                        if (!validator(value)) {
                            warn(`Invalid prop: custom validator check failed for prop "${name}".`)
                        }
                    },
                },
            }
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

/**
 * 断言 prop 的值是否有效（小程序就没有 required 的概念）
 * @param {Object} prop
 * @param {String} name 属性名称
 * @param {any} value
 */
export const assertProp = ({
    prop,
    name,
    value,
}) => {
    if (value == null) return

    const expectedTypes = []
    const { type } = prop
    let valid = !type

    if (type) {
        const typeList = !Array.isArray(type)
            ? [type]
            : type

        typeList.forEach((type) => {
            const {
                valid: newValid,
                expectedType,
            } = assertType(value, type)

            expectedTypes.push(expectedType || '')
            valid = newValid
        })
    }

    if (!valid) {
        warn(
            `Invalid prop: type check failed for prop "${name}".` +
            ` Expected ${expectedTypes.join(', ')}` +
            `, got ${toRawType(value)}.`
        )
    }
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

/**
 * 使用函数的名称字符串来检查内置的类型
 * 因为简单的相等检查，在不同的 vms 或 iframes 中运行时会判断错误
 */
export const getType = (fn) => {
    const match = fn &&
        fn.toString().match(/^\s*function (\w+)/)

    return match ? match[1] : ''
}

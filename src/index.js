import {
    warn,
    isFn,
    toRawType,
} from './utils'
import {
    getObserveDeep,
    getAsyncSetData,
} from './observer/index'
import {
    bindData,
    bindComputed,
} from './init'

// Vue 还多支持了 Function 和 Symbol 类型
const TYPES = [String, Number, Boolean, Object, Array, null]

/**
 * 断言 prop 的值是否有效（小程序就没有 required 的概念）
 * @param {Object} prop
 * @param {String} name 属性名称
 * @param {any} value
 */
const assertProp = ({
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
const assertType = (value, type) => {
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
const getType = (fn) => {
    const match = fn && fn.toString().match(/^\s*function (\w+)/)
    return match ? match[1] : ''
}

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
 * 适配 Vue 风格代码，使其支持在小程序中运行（告别不方便的 setData）
 * @param {Object} args Component 参数
 */
export const TuaComp = (args) => {
    const {
        data: rawData,
        props = {},
        watch = {},
        methods = {},
        computed = {},
        properties = {},
        ...rest
    } = args

    const data = isFn(rawData) ? rawData() : rawData

    return Component({
        ...rest,
        data,
        methods,
        properties: {
            ...properties,
            ...getPropertiesFromProps(props),
        },
        attached (...options) {
            const asyncSetData = getAsyncSetData(this, watch)
            const observeDeep = getObserveDeep(asyncSetData)

            // 遍历递归观察 data
            bindData(this, observeDeep)

            // 遍历观察 computed
            bindComputed(this, computed, asyncSetData)

            rest.attached && rest.attached.apply(this, options)
        },
    })
}

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
            bindComputed(this, computed, asyncSetData)

            rest.onLoad && rest.onLoad.apply(this, options)
        },
    })
}

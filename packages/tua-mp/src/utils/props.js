import {
    isFn,
    warn,
    toRawType,
    assertType,
} from './basic'
import { TYPES } from '../constants'

/**
 * 断言 prop 的值是否有效
 * ps 小程序就没有 required 的概念
 * @param {Object} prop 定义
 * @param {Array|Function|null} prop.type 定义类型
 * @param {String} name 属性名称
 * @param {any} value 实际值
 * @return {Boolean} 是否有效
 */
export const assertProp = ({ prop, name, value }) => {
    if (value == null) return true

    const expectedTypes = []
    const { type } = prop
    let valid = !type

    if (type) {
        const typeList = !Array.isArray(type)
            ? [ type ]
            : type

        typeList.forEach((type) => {
            const {
                valid: newValid,
                expectedType,
            } = assertType(value, type)

            expectedTypes.push(expectedType)
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

    return valid
}

/**
 * 生成组件的 observer 函数
 * @param {String} name 名称
 * @param {Object} prop 类型定义对象（透传给 assertProp）
 * @param {Array|Function|null} prop.type 定义类型
 */
export const getObserver = (name) => (prop) => {
    return function observer (value) {
        // 触发 setter
        Promise.resolve().then(() => {
            this[name] = value
        })

        const valid = assertProp({ prop, name, value })
        const { validator } = prop

        if (validator && !validator(value)) {
            warn(`Invalid prop: custom validator check failed for prop "${name}".`)
            return false
        }

        return valid
    }
}

/**
 * 生成完整单个 prop 对象
 * @param {String} name 名称
 * @param {String|Number|Boolean|Object|Array|null} type 类型
 * @param {any} value 值
 * @param {Object} propObj 类型定义对象（透传给 assertProp）
 * @param {Array|Function|null} propObj.type 定义类型
 */
export const getPropObj = ({ name, type, value, propObj }) => ({
    [name]: {
        type,
        value,
        observer: getObserver(name)(propObj),
    },
})

/**
 * 将 Vue 风格的 props 改写成小程序原生的 properties
 * @param {Array|Object} props
 */
export const getPropertiesFromProps = (props) => {
    // 输入数组则转译成接受任意数据类型的 null
    if (Array.isArray(props)) {
        return props
            .map((name) => getPropObj({
                name,
                type: null,
                propObj: { type: null },
            }))
            .reduce((acc, cur) => ({ ...acc, ...cur }), {})
    }

    return Object.keys(props)
        .map((name) => {
            const prop = props[name]

            // 基本类型的直接返回
            if (TYPES.indexOf(prop) !== -1) {
                return getPropObj({
                    name,
                    type: prop,
                    propObj: { type: prop },
                })
            }

            // 数组形式的 prop
            // 测试了下不支持直接简写或 type 是数组，只能手动检查了
            if (Array.isArray(prop)) {
                return getPropObj({
                    name,
                    type: null,
                    propObj: { type: prop },
                })
            }

            // 对象形式的 prop
            return getPropObj({
                name,
                type: prop.type || null,
                value: isFn(prop.default)
                    ? prop.default()
                    : prop.default,
                propObj: prop,
            })
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

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
export const assertProp = ({
    prop,
    name,
    value,
}) => {
    if (value == null) return true

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
 * 将 Vue 风格的 props 改写成小程序原生的 properties
 * @param {Array|Object} props
 */
export const getPropertiesFromProps = (props) => {
    // 输入数组则转译成接受任意数据类型的 null
    if (Array.isArray(props)) {
        return props
            .map(prop => ({ [prop]: null }))
            .reduce((acc, cur) => ({ ...acc, ...cur }), {})
    }

    return Object.keys(props)
        .map((name) => {
            const prop = props[name]

            // 基本类型的直接返回
            if (TYPES.indexOf(prop) !== -1) {
                return { [name]: prop }
            }

            const getObserverByProp = (prop) => {
                return function (value) {
                    const valid = assertProp({ prop, name, value })

                    const { validator } = prop

                    if (validator && !validator(value)) {
                        warn(`Invalid prop: custom validator check failed for prop "${name}".`)
                        return false
                    }

                    return valid
                }
            }

            // 测试了下不支持直接简写或 type 是数组，只能手动检查了
            if (Array.isArray(prop)) {
                const property = {
                    type: null,
                    observer: getObserverByProp({ type: prop }),
                }

                return { [name]: property }
            }

            // 对象形式的 prop
            const property = {
                type: prop.type || null,
                value: isFn(prop.default)
                    ? prop.default()
                    : prop.default,
                observer: getObserverByProp(prop),
            }

            return { [name]: property }
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

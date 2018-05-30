import { noop } from './utils'
import { isFn } from '../src/utils'

let uid = 0

/**
 * 对于小程序中 Page 的简单 Mock
 */
global.Page = ({ data, ...rest }) => {
    const page = {
        data,
        setData: jest.fn(function (newData) {
            this.data = {
                ...this.data,
                ...newData,
            }
        }),
        onLoad: noop,
        ...rest,
        __wxWebviewId__: uid++,
    }

    page.onLoad()

    return page
}

/**
 * 对于小程序中 Component 的简单 Mock
 */
global.Component = ({ data, properties, ...rest }) => {
    const props = Object.keys(properties)
        .map((key) => {
            const prop = properties[key]
            const { type, value } = prop
            const getValue = (obj) => isFn(obj)
                ? obj() : obj === null
                    ? '' : obj.value == null
                        ? getValue(obj.type) : obj.value

            const propValue = getValue(prop)

            return { [key]: propValue }
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

    const Component = {
        data: {
            ...data,
            ...props,
        },
        properties,
        setData: jest.fn(function (newData) {
            this.data = {
                ...this.data,
                ...newData,
            }
        }),
        attached: noop,
        ...rest,
        __wxWebviewId__: uid++,
        __wxExparserNodeId__: uid++,
    }

    Component.attached()

    return Component
}

import { noop } from '../__tests__/utils'
import { isFn } from '../src/utils'

let wId = 0
let nId = 0

/**
 * 对于小程序中 Page 的简单 Mock
 */
global.Page = ({ data, ...rest }) => {
    const page = {
        data,
        setData: jest.fn(function (newData, cb) {
            this.data = {
                ...this.data,
                ...newData,
            }

            cb && cb()
        }),
        onLoad: noop,
        onReady: noop,
        onUnLoad: noop,
        __wxWebviewId__: wId++,
        ...rest,
    }

    page.onLoad()
    page.onReady()

    return page
}

/**
 * 对于小程序中 Component 的简单 Mock
 */
global.Component = ({ data, properties, methods, ...rest }) => {
    const props = Object.keys(properties)
        .map((key) => {
            const prop = properties[key]
            const getValue = (obj) => isFn(obj)
                ? obj() : obj === null
                    ? '' : obj.value == null
                        ? getValue(obj.type) : obj.value

            const propValue = getValue(prop)

            return { [key]: propValue }
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

    const Component = {
        data: { ...data, ...props },
        properties,
        setData: jest.fn(function (newData, cb) {
            this.data = {
                ...this.data,
                ...newData,
            }

            cb && cb()
        }),
        created: noop,
        attached: noop,
        ready: noop,
        detached: noop,
        __wxWebviewId__: wId++,
        __wxExparserNodeId__: nId++,
        ...methods,
        ...rest,
    }

    Component.created()
    Component.attached()
    Component.ready()

    return Component
}

import {
    assertProp,
    getPropertiesFromProps,
} from '../../src/utils'

const stringify = JSON.stringify.bind(JSON)

test('assertProp', () => {
    expect(assertProp({ value: null })).toBe(true)
    expect(assertProp({
        prop: { type: null },
        name: 'null',
        value: 'steve',
    })).toBe(true)
    expect(assertProp({
        prop: { type: Number },
        name: 'Number',
        value: 'steve',
    })).toBe(false)
    expect(assertProp({
        prop: { type: Number },
        name: 'Number',
        value: 1217,
    })).toBe(true)
    expect(assertProp({
        prop: { type: [Number, String] },
        name: 'Array',
        value: '1217',
    })).toBe(true)
})

test('getPropertiesFromProps', () => {
    const properties = getPropertiesFromProps({
        propA: Number,
        propB: [String, Number],
        propC: {
            type: String,
            required: true,
        },
        propD: {
            type: Number,
            default: 100,
        },
        propE: {
            type: Object,
            default: () => ({ message: 'hello' }),
        },
        propF: {
            validator (value) {
                return ['success', 'warning', 'danger'].indexOf(value) !== -1
            },
        },
    })

    const expectedProperties = {
        propA: Number,
        propB: {
            type: null,
            observer () {},
        },
        propC: {
            type: String,
            observer () {},
            value: undefined,
        },
        propD: {
            type: Number,
            value: 100,
            observer () {},
        },
        propE: {
            type: Object,
            value: { message: 'hello' },
            observer () {},
        },
        propF: {
            type: null,
            value: undefined,
            observer () {},
        },
    }
    expect(stringify(properties)).toBe(stringify(expectedProperties))

    const arrayProperties = getPropertiesFromProps(['steve', 'young'])
    const arrayExpectedProperties = {
        steve: null,
        young: null,
    }
    expect(stringify(arrayProperties)).toBe(stringify(arrayExpectedProperties))

    expect(properties.propB.observer({})).toBe(false)
    expect(properties.propF.observer('steve')).toBe(false)
    expect(properties.propF.observer('success')).toBe(true)
})

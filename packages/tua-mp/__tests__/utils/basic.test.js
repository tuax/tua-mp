import {
    isFn,
    getType,
    toRawType,
    proxyData,
    assertType,
    pathStr2Arr,
    setObjByPath,
    isPlainObject,
} from '../../src/utils'

test('isFn', () => {
    expect(isFn(() => {})).toBe(true)
    expect(isFn('noop')).toBe(false)
})

test('toRawType', () => {
    expect(toRawType({})).toBe('Object')
    expect(toRawType('')).toBe('String')
    expect(toRawType([])).toBe('Array')
    expect(toRawType(123)).toBe('Number')
})

test('getType', () => {
    expect(getType(Number)).toBe('Number')
    expect(getType(String)).toBe('String')
    expect(getType(Boolean)).toBe('Boolean')
    expect(getType(Object)).toBe('Object')
    expect(getType(Array)).toBe('Array')
    expect(getType({})).toBe('')
})

test('proxyData', () => {
    const obj1 = {
        a: [0],
        b: 'b',
        c: { d: 'd' }
    }
    const obj2 = {}
    proxyData(obj1, obj2)

    expect(obj2.a[0]).toBe(obj1.a[0])
    expect(obj2.a).toBe(obj1.a)
    expect(obj2.b).toBe(obj1.b)
    expect(obj2.c).toBe(obj1.c)
    expect(obj2.c.d).toBe(obj1.c.d)
})

test('assertType', () => {
    function Foo () {}

    expect(assertType('str', String))
        .toEqual({ expectedType: 'String', valid: true })
    expect(assertType(123, Number))
        .toEqual({ expectedType: 'Number', valid: true })
    expect(assertType(true, Boolean))
        .toEqual({ expectedType: 'Boolean', valid: true })
    expect(assertType({}, Object))
        .toEqual({ expectedType: 'Object', valid: true })
    expect(assertType([], Array))
        .toEqual({ expectedType: 'Array', valid: true })
    expect(assertType(new Number(), Number))
        .toEqual({ expectedType: 'Number', valid: true })
    expect(assertType(new Foo(), Foo))
        .toEqual({ expectedType: 'Foo', valid: true })

    expect(assertType(123, String))
        .toEqual({ expectedType: 'String', valid: false })
    expect(assertType('123', Number))
        .toEqual({ expectedType: 'Number', valid: false })
    expect(assertType([], Object))
        .toEqual({ expectedType: 'Object', valid: false })
    expect(assertType({}, Array))
        .toEqual({ expectedType: 'Array', valid: false })
})

test('pathStr2Arr', () => {
    expect(pathStr2Arr('a.b.c')).toEqual(['a', 'b', 'c'])
    expect(pathStr2Arr('a[1].b.c')).toEqual(['a', '1', 'b', 'c'])
    expect(pathStr2Arr('a[1][2].c')).toEqual(['a', '1', '2', 'c'])
    expect(pathStr2Arr('a[12][17].c')).toEqual(['a', '12', '17', 'c'])
})

test('setObjByPath', () => {
    const obj = {}
    setObjByPath({ obj, path: 'a.b.c', val: 1 })
    setObjByPath({ obj, path: 'a.b.d', val: 2 })
    setObjByPath({ obj, path: 'arr[0].b.c', val: 3 })

    expect(obj.a.b.c).toEqual(1)
    expect(obj.a.b.d).toEqual(2)
    expect(obj.arr[0].b.c).toEqual(3)
})

test('isPlainObject', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject('')).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(123)).toBe(false)
})

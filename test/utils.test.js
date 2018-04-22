import { isFn, proxyData } from '../src/utils'

test('isFn', () => {
    expect(isFn(() => {})).toBe(true)
    expect(isFn('noop')).toBe(false)
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

const {
    map,
    pipe,
    filter,
    flatten,
    compose,
    mergeAll,
    isDirectory,
    fsExistsFallback,
} = require('../lib/utils')

test('map', () => {
    const fn = x => x
    const arr = [1, 2, 3]

    expect(map(fn)(arr)).toEqual(arr)
})

test('pipe', () => {
    const double = x => x * 2
    const square = x => x * x

    expect(pipe()(5)).toBe(5)
    expect(pipe(square)(5)).toBe(25)
    expect(pipe(square, double)(5)).toBe(50)
    expect(pipe(double, square, double)(5)).toBe(200)
})

test('filter', () => {
    const fn = x => x > 2
    const arr = [1, 2, 3]

    expect(filter(fn)(arr)).toEqual([3])
})

test('flatten', () => {
    const arr = [[1], [2], [3]]

    expect(flatten(arr)).toEqual([1, 2, 3])
})

test('compose', () => {
    const double = x => x * 2
    const square = x => x * x

    expect(compose()(5)).toBe(5)
    expect(compose(square)(5)).toBe(25)
    expect(compose(square, double)(5)).toBe(100)
    expect(compose(double, square, double)(5)).toBe(200)
})

test('isDirectory', () => {
    expect(isDirectory(__dirname)).toBe(true)
    expect(isDirectory(__filename)).toBe(false)
})

test('mergeAll', () => {
    const arr = [
        { a: 'a' },
        { b: 'b' },
        { c: 'c' },
    ]

    expect(mergeAll(arr)).toEqual({
        a: 'a',
        b: 'b',
        c: 'c',
    })
})

test('fsExistsFallback', () => {
    const result1 = fsExistsFallback([
        'foo',
        'foobar',
        'whatever',
        __filename,
    ])
    const result2 = fsExistsFallback([
        'foo',
        __filename,
        'whatever',
    ])

    expect(result1).toBe(__filename)
    expect(result2).toBe(__filename)
    expect(fsExistsFallback()).toBeUndefined()
})

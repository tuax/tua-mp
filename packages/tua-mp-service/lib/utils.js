const fs = require('fs')

const map = fn => arr => arr.map(fn)
const filter = fn => arr => arr.filter(fn)
const isDirectory = url => fs.statSync(url).isDirectory()

const flatten = arr =>
    arr.reduce((acc, cur) => [...acc, ...cur], [])
const mergeAll = arr =>
    arr.reduce((acc, cur) => ({ ...acc, ...cur }), {})

/**
 * 从左向右结合函数
 * @param {Function[]} funcs 函数数组
 */
const pipe = (...funcs) => {
    if (funcs.length === 0) return arg => arg
    if (funcs.length === 1) return funcs[0]

    return funcs.reduce((a, b) => (...args) => b(a(...args)))
}

/**
 * 从右向左结合函数
 * @param {Function[]} funcs 函数数组
 */
const compose = (...funcs) => {
    if (funcs.length === 0) return arg => arg
    if (funcs.length === 1) return funcs[0]

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

const error = (err) => {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') return

    /* istanbul ignore next */
    console.error(`[TUA-MP-SERVICE]: `, err)
}

module.exports = {
    map,
    pipe,
    error,
    filter,
    flatten,
    compose,
    mergeAll,
    isDirectory,
}

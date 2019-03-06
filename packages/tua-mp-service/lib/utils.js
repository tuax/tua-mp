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

/**
 * 统一的日志输出函数，在测试环境时不输出
 * @param {String} type 输出类型 log|warn|error
 * @param {any} out 具体的输出内容
 */
const logByType = (type) => (...out) => {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') return

    /* istanbul ignore next */
    console[type](`[TUA-MP-SERVICE]:`, ...out)
}

/**
 * 从前到后检查文件数组中的文件是否存在，若存在则返回
 * @param {String[]} files 文件路径数组
 */
const fsExistsFallback = (files = []) => {
    for (const file of files) {
        if (!fs.existsSync(file)) continue

        return file
    }
}

module.exports = {
    log: logByType('log'),
    warn: logByType('warn'),
    error: logByType('error'),
    map,
    pipe,
    filter,
    flatten,
    compose,
    mergeAll,
    isDirectory,
    fsExistsFallback,
}

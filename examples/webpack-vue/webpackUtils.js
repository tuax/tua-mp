import fs from 'fs'
import path from 'path'

const map = fn => arr => arr.map(fn)
const filter = fn => arr => arr.filter(fn)
const isDirectory = url => fs.statSync(url).isDirectory()
const isIndexJsExists = dir => fs.existsSync(resolve(dir, 'index.js'))

const flatArr = arr =>
    arr.reduce((acc, cur) => [...acc, ...cur], [])
const mergeObjArr = arr =>
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

// 获取 url 到 src/ 直接的相对路径
const getRelativePath = (url) => [
    path.relative(resolve('src'), url),
    url.split(path.sep).slice(-1),
].join(path.sep)

// 由 url 获取最终的 entry 对象
const getNameUrlObj = url => ({ [getRelativePath(url)]: [url] })

/**
 * 过滤出 base 下的文件夹的名称 dir 和绝对路径 url
 * @param {String} base 基础路径 pages|comps
 * @return {Array} 含有 dir 和 url 的数组
 */
const getDirArr = (base) => fs
    .readdirSync(resolve('src', base))
    .map(dir => resolve('src', base, dir))
    .filter(isDirectory)

// 获取拍平后的子目录数组
const getSubDirArr = pipe(
    map(getDirArr),
    flatArr
)

// -- export --

export const resolve = (...urls) => path.resolve(__dirname, ...urls)

/**
 * 通过 base 下的文件夹名称，生成类似
 * pages/index/index
 * comps/TuaImage/TuaImage
 * 这样的路径作为 name，以便后续生成对应路径上的 js 和 wxss
 * @param {String} base 基础路径 pages|comps
 * @return {Object} 对象形式的 entry
 */
export const getEntryByDir = pipe(
    getDirArr,
    filter(isIndexJsExists),
    map(getNameUrlObj),
    mergeObjArr
)

/**
 * 对于页面 foo 下的页面级组件 bar，
 * 生成类似 pages/foo/comps/bar/ 这样的入口
 * @return {Object} 对象形式的 entry
 */
export const getPagesCompsEntry = pipe(
    getDirArr,
    getSubDirArr,
    getSubDirArr,
    filter(isIndexJsExists),
    map(getNameUrlObj),
    mergeObjArr
)

// 由后缀和完整文件路径，得到对应输出路径，用于 file-loader 输出文件
export const getNameByFilePath = compose(getRelativePath, path.dirname)

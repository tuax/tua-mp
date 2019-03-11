const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const mkdir = promisify(fs.mkdir)
const exists = fs.existsSync
const copyFile = promisify(fs.copyFile)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const appendFile = promisify(fs.appendFile)

/**
 * 同步递归创建文件夹，例如要创建 a/b/c/，如果没有中间路径则会递归创建
 * @param {String} dir 文件夹路径
 */
const rMkdir = async (dir) => {
    const lastDir = path.parse(dir).dir

    if (!exists(lastDir)) {
        await rMkdir(lastDir)
    }

    return mkdir(dir)
}

/**
 * 从前到后检查文件数组中的文件是否存在，若存在则返回
 * @param {String[]} files 文件路径数组
 */
const fsExistsFallback = (files = []) => {
    for (const file of files) {
        if (!exists(file)) continue

        return file
    }
}

/**
 * 读取项目中的 tua.config.js 中的配置
 */
const readConfigFile = (base = process.cwd()) => {
    const configPath = path.resolve(base, `tua.config.js`)

    return exists(configPath) ? require(configPath) : {}
}

const cwd = process.cwd()
const getTemplateDir = (dir, prefix = '') => fsExistsFallback([
    path.resolve(cwd, dir || '.templates', prefix),
    path.resolve(__dirname, '../../templates', prefix),
])

module.exports = {
    mkdir,
    exists,
    rMkdir,
    copyFile,
    readFile,
    writeFile,
    appendFile,
    getTemplateDir,
    readConfigFile,
    fsExistsFallback,
}

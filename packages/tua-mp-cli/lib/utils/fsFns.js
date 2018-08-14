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

module.exports = {
    mkdir,
    exists,
    rMkdir,
    copyFile,
    readFile,
    writeFile,
    appendFile,
}

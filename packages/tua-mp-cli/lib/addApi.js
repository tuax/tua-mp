const path = require('path')
const treeify = require('treeify')

const {
    log,
    info,
    exists,
    copyFile,
    appendFile,
    catchAndThrow,
    fsExistsFallback,
    compileTmplToTarget,
    hyphenCaseToCamelCase,
} = require('./utils')

const cwd = process.cwd()

/**
 * 添加 api 功能
 * 如果是连字符形式的中间接口路径需要将文件名转成小驼峰
 * 但 api 配置中的 prefix 依然保持原样
 * @param {String} name 接口名称
 * @param {Object} tuaConfig 项目自定义配置
 */
module.exports = (name, tuaConfig = {}) => {
    if (!name) return catchAndThrow(`api 名称不能为空\n`)

    // 小驼峰的名称
    const ccName = hyphenCaseToCamelCase(name)
    const outputStr = `小程序 api -> ${name}.js`
    const treeLog = treeify.asTree({
        'src/apis': {
            '...': null,
            [`${name}.js`]: null,
            'index.js': null,
        },
    })

    // 默认放在 src/apis/ 下
    const targetDir = process.env.TUA_CLI_TEST_DIR ||
        /* istanbul ignore next */
        path.resolve(cwd, './src/apis/')

    // 检查父文件夹是否存在
    if (!exists(targetDir)) {
        const str = `请检查以下文件夹是否存在!\n\t- src/apis/\n`
        return catchAndThrow(str)
    }

    // src
    const templateDir = process.env.TUA_CLI_TEST_SRC ||
        /* istanbul ignore next */
        fsExistsFallback([
            tuaConfig.templateDir,
            path.resolve(cwd, tuaConfig.templateDir),
            path.resolve(cwd, './templates/api/'),
            path.resolve(__dirname, '../templates/api/'),
        ])
    const srcIdx = path.join(templateDir, 'index.js')
    const srcApi = path.join(templateDir, 'api.js')

    // dist
    const targetPath = process.env.TUA_CLI_TEST_DIST ||
        /* istanbul ignore next */
        path.join(targetDir, `${name}.js`)
    const targetIndex = path.join(targetDir, `index.js`)

    // 写入 index.js 中的代码
    const exportStr = `export const ${ccName}Api = tuaApi.getApi(require('./${name}').default)\n`

    // 编译模板
    const compileParams = {
        src: srcApi,
        dist: targetPath,
        meta: { name },
    }

    const tasks = [ compileTmplToTarget(compileParams) ]

    // 复制 index.js
    if (!exists(targetIndex)) {
        tasks.push(copyFile(srcIdx, targetIndex))
    }

    return Promise.all(tasks)
        .then(([{ isCancel, isCover }]) => isCancel
            ? info(`取消添加${outputStr}`)
            : isCover
                // 已有该 api，不重复添加 到 api/index.js 中
                ? log(`成功覆盖${outputStr}\n${treeLog}`)
                // 将该 api 添加到 apis/index.js 中
                : appendFile(targetIndex, exportStr)
                    .then(() => log(`成功添加${outputStr}\n${treeLog}`))
        )
        .catch(catchAndThrow)
}

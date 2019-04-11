const path = require('path')
const treeify = require('treeify')

const {
    log,
    info,
    exists,
    copyFile,
    appendFile,
    catchAndThrow,
    getTemplateDir,
    compileTmplToTarget,
    hyphenCaseToCamelCase,
} = require('./utils')
const { defaultTuaConfig } = require('./constants')

const cwd = process.cwd()

/**
 * 添加 api 功能
 * 如果是连字符形式的中间接口路径需要将文件名转成小驼峰
 * 但 api 配置中的 prefix 依然保持原样
 * @param {Object} options
 * @param {String} options.name 接口名称
 * @param {Object} options.tuaConfig 项目自定义配置
 */
module.exports = (options = {}) => {
    const {
        name,
        tuaConfig = defaultTuaConfig,
    } = options

    if (!name) return catchAndThrow(`api 名称不能为空\n`)

    // 小驼峰的名称
    const ccName = hyphenCaseToCamelCase(name)
    const outputStr = ` api -> ${name}`
    const relativePath = 'src/apis'
    const treeLog = treeify.asTree({
        [relativePath]: {
            [`${relativePath}/index.js`]: null,
            [`${relativePath}/${name}.js`]: null,
        },
    })

    // 默认放在 relativePath 下
    const targetDir = process.env.TUA_CLI_TEST_DIR ||
        /* istanbul ignore next */
        path.resolve(cwd, relativePath)

    // 检查父文件夹是否存在
    if (!exists(targetDir)) {
        return catchAndThrow(
            `请检查以下文件夹是否存在!\n` +
            `\t- ${relativePath}/\n`
        )
    }

    // src
    const prefix = 'api'
    const templateDir = process.env.TUA_CLI_TEST_SRC ||
        /* istanbul ignore next */
        getTemplateDir(tuaConfig.templateDir, prefix)
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

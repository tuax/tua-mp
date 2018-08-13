const path = require('path')
const treeify = require('treeify')

const {
    log,
    info,
    exists,
    appendFile,
    catchAndThrow,
    compileTmplToTarget,
    hyphenCaseToCamelCase,
} = require('./utils')

// TODO: 读取 .tuarc 和 tua-mp.config.js 中的配置

/**
 * 添加 api 功能
 * 如果是连字符形式的中间接口路径需要将文件名转成小驼峰
 * 但 config 中的 prefix 依然保持原样
 * @param {String} name 接口名称
 */
const addApi = (name) => {
    if (!name) {
        return catchAndThrow(`api 名称不能为空\n`)
    }

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
        path.resolve(process.cwd(), './src/apis/')

    // 检查父文件夹是否存在
    if (!exists(targetDir)) {
        return catchAndThrow(
            `请检查以下文件夹是否存在!\n` +
            `\t- src/apis/\n`
        )
    }

    // src
    const templateSrc = process.env.TUA_CLI_TEST_SRC ||
        /* istanbul ignore next */
        path.resolve(__dirname, '../templates/api.js')

    // dist
    const targetPath = process.env.TUA_CLI_TEST_DIST ||
        /* istanbul ignore next */
        path.join(targetDir, `${name}.js`)
    const targetIndex = path.join(targetDir, `index.js`)

    // 写入 index.js 中的代码
    const exportStr = `export ${ccName}Api from './${name}'\n`

    // 编译模板
    const compileParams = {
        src: templateSrc,
        dist: targetPath,
        meta: { name },
    }

    return compileTmplToTarget(compileParams)
        .then(({ isCancel, isCover }) => isCancel
            ? info(`取消添加${outputStr}`)
            : isCover
                // 已有该 api，不重复添加 到 api/index.js 中
                ? log(
                    `成功覆盖${outputStr}\n` +
                    treeLog
                )
                // 将该 api 添加到 apis/index.js 中
                : appendFile(targetIndex, exportStr)
                    .then(() => log(
                        `成功添加${outputStr}\n` +
                        treeLog
                    ))
        )
        .catch(catchAndThrow)
}

module.exports = addApi

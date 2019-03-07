const path = require('path')
const treeify = require('treeify')

const {
    log,
    mkdir,
    exists,
    copyFile,
    writeFile,
    promptAndRun,
    catchAndThrow,
    compileTmplToTarget,
    camelCaseToHyphenCase,
    hyphenCaseToUpperCamelCase,
} = require('./utils')

// TODO: 读取 .tuarc 和 tua-mp.config.js 中的配置

/**
 * 添加页面功能
 * 如果是连字符形式的页面地址，需要将 .vue 文件的文件名转成大驼峰
 * 但在 app.json 中的页面名称保持原样
 * @param {String} name 接口名称（连字符）
 */
module.exports = (name) => {
    if (!name) return catchAndThrow(`页面名称不能为空\n`)

    // 连字符的名称
    const hcName = camelCaseToHyphenCase(name)
    // 大驼峰的名称
    const uccName = hyphenCaseToUpperCamelCase(name)
    const outputStr = `小程序页面 -> ${hcName}`
    const treeLog = treeify.asTree({
        'src/pages': {
            '...': null,
            [hcName]: {
                [`${uccName}.vue`]: null,
                'index.js': null,
            },
        },
    })

    // 应用配置默认放在 src/app/app.json 下
    const targetApp = process.env.TUA_CLI_TEST_APP ||
        /* istanbul ignore next */
        path.resolve(process.cwd(), './src/app/app.json')

    // 默认放在 src/pages/ 下
    const targetDir = process.env.TUA_CLI_TEST_DIR ||
        /* istanbul ignore next */
        path.resolve(process.cwd(), './src/pages/')
    const targetPath = process.env.TUA_CLI_TEST_DIST ||
        /* istanbul ignore next */
        path.join(targetDir, `${hcName}`)

    // 检查父文件夹和 app.json 是否存在
    if (!exists(targetApp) || !exists(targetDir)) {
        return catchAndThrow(
            `请检查以下文件（夹）是否存在!\n` +
            `\t- src/app/app.json\n` +
            `\t- src/pages/\n`
        )
    }

    // src
    const templateDir = process.env.TUA_CLI_TEST_SRC ||
        /* istanbul ignore next */
        path.resolve(__dirname, '../templates/page/')
    const srcIdx = path.join(templateDir, 'index.js')
    const srcPage = path.join(templateDir, 'Page.vue')

    // dist
    const distIdx = path.join(targetPath, 'index.js')
    const distPage = path.join(targetPath, `${uccName}.vue`)

    // 将页面添加到 app.json 中，并按照长度排序
    const insertPageToApp = (appJson) => {
        const pagePath = `pages/${hcName}/${hcName}`

        // 兼容没有 pages
        appJson.pages = appJson.pages || []

        // 添加
        if (appJson.pages.indexOf(pagePath) === -1) {
            appJson.pages.push(pagePath)
        }

        // 排序（排除首页）
        const firstPage = appJson.pages[0]
        appJson.pages.shift()
        appJson.pages.sort((a, b) => a.length - b.length)
        appJson.pages.unshift(firstPage)
        log(`成功写入 app.json -> ${pagePath}`)

        return appJson
    }

    // 将页面地址写入 app.json 中
    const addPageToApp = () => Promise.resolve(require(targetApp))
        .then(insertPageToApp)
        .then(o => JSON.stringify(o, null, 4))
        .then(s => writeFile(targetApp, s))
        .catch(catchAndThrow)

    const run = (isCover = false) => {
        const tasks = [
            // 编译模板
            compileTmplToTarget({
                src: srcIdx,
                dist: distIdx,
                meta: { name: uccName },
                isCover,
            }),
            // 拷贝 Page.vue -> <name>.vue
            copyFile(srcPage, distPage),
            // 更新 app.json
            addPageToApp(),
        ]

        return Promise.all(tasks)
            .then(() => log(
                `成功${isCover ? '覆盖' : '添加'}${outputStr}\n` +
                // 展示树状结构
                treeLog
            ))
            .catch(catchAndThrow)
    }

    return promptAndRun({
        run,
        message: 'Target directory exists. Continue?',
        beforeFn: () => mkdir(targetPath),
        targetPath,
    })
}

const path = require('path')
const treeify = require('treeify')
const inquirer = require('inquirer')

const {
    log,
    mkdir,
    exists,
    rMkdir,
    copyFile,
    promptAndRun,
    catchAndThrow,
    getTemplateDir,
    compileTmplToTarget,
    hyphenCaseToUpperCamelCase,
} = require('./utils')
const { defaultTuaConfig } = require('./constants')

const cwd = process.cwd()

/**
 * 添加组件功能，组件全用大驼峰命名
 * 如果没有 dist 则添加的是全局组件，有 dist 则添加到目标地址
 * @param {Object} options
 * @param {String} options.name 接口名称（连字符）
 * @param {Boolean} options.global 是否是全局组件
 * @param {Object} options.tuaConfig 项目自定义配置
 */
module.exports = (options = {}) => {
    const {
        name,
        global = false,
        tuaConfig = defaultTuaConfig,
    } = options

    if (!name) return catchAndThrow(`组件名称不能为空\n`)

    // 大驼峰的名称
    const uccName = hyphenCaseToUpperCamelCase(name)
    const outputStr = `${global ? '全局' : '页面'}小程序组件 -> ${uccName}`
    const compsPath = 'src/comps'

    const getTreeLog = (prefix) => {
        const relativePath = `${prefix}/${uccName}`

        return treeify.asTree({
            [relativePath]: {
                [`${relativePath}/index.js`]: null,
                [`${relativePath}/${uccName}.vue`]: null,
            },
        })
    }

    // 全局组件放在 compsPath 下
    const targetDir = process.env.TUA_CLI_TEST_DIR ||
        /* istanbul ignore next */
        path.resolve(cwd, compsPath)
    const targetPath = process.env.TUA_CLI_TEST_DIST ||
        /* istanbul ignore next */
        path.join(targetDir, `${uccName}`)

    // src
    const prefix = 'comp'
    const templateDir = process.env.TUA_CLI_TEST_SRC ||
        /* istanbul ignore next */
        getTemplateDir(tuaConfig.templateDir, prefix)
    const srcIdx = path.join(templateDir, 'index.js')
    const srcComp = path.join(templateDir, 'Comp.vue')

    const runByTargetPath = (targetPath, pathPrefix) => (isCover = false) => {
        // dist
        const distIdx = path.join(targetPath, 'index.js')
        const distComp = path.join(targetPath, `${uccName}.vue`)

        const tasks = [
            // 编译模板
            compileTmplToTarget({
                src: srcIdx,
                dist: distIdx,
                meta: { name: uccName },
                isCover,
            }),
            // 拷贝 Comp.vue -> <name>.vue
            copyFile(srcComp, distComp),
        ]

        return Promise.all(tasks)
            .then(() => log(
                `成功${isCover ? '覆盖' : '添加'}${outputStr}\n` +
                getTreeLog(pathPrefix)
            ))
            .catch(catchAndThrow)
    }

    // 添加自定义路径组件
    if (!global) {
        const questions = [{
            type: 'fuzzypath',
            name: 'path',
            message: 'Select a target directory for your component:',
            rootPath: 'src',
            pathFilter:
                /* istanbul ignore next */
                isDirectory => isDirectory,
            // default 不起作用...
            // https://github.com/mokkabonna/inquirer-autocomplete-prompt/pull/38
            default: compsPath,
            suggestOnly: true,
        }]

        return inquirer.prompt(questions).then((answer) => {
            const targetDir = process.env.TUA_CLI_TEST_DIR ||
                /* istanbul ignore next */
                path.resolve(cwd, answer.path)

            const targetPath = process.env.TUA_CLI_TEST_DIST ||
                /* istanbul ignore next */
                path.join(targetDir, `${uccName}`)

            return promptAndRun({
                run: runByTargetPath(targetPath, answer.path),
                message: 'Target directory exists. Continue?',
                beforeFn: () => rMkdir(targetPath),
                targetPath,
            })
        })
    }

    // 检查父文件夹是否存在
    if (!exists(targetDir)) {
        return catchAndThrow(
            `请检查以下文件夹是否存在!\n` +
            `\t- ${compsPath}\n`
        )
    }

    return promptAndRun({
        run: runByTargetPath(targetPath, compsPath),
        message: 'Target directory exists. Continue?',
        beforeFn: () => mkdir(targetPath),
        targetPath,
    })
}

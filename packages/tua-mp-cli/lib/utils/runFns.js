const inquirer = require('inquirer')
const Handlebars = require('handlebars')

const { catchAndThrow } = require('./logFns')
const { exists, readFile, writeFile } = require('./fsFns')

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

/**
 * 如果目标地址存在文件，询问是否覆盖，然后执行流程
 * @param {Function} run 执行流程函数
 * @param {Boolean} isCover 是否直接覆盖
 * @param {String} message 询问信息
 * @param {Function} beforeFn 钩子函数（一般用在创建文件夹）
 * @param {String} targetPath 目标地址
 */
const promptAndRun = ({
    run,
    isCover = false,
    message,
    beforeFn = () => Promise.resolve(),
    targetPath,
}) => {
    // 不存在或明确要覆盖，则直接运行
    if (!exists(targetPath) || isCover) {
        return beforeFn().then(run).catch(catchAndThrow)
    }

    const msgs = [{ type: 'confirm', message, name: 'ok' }]

    // 已存在则询问
    return inquirer.prompt(msgs)
        .then((answer) => answer.ok
            // 覆盖
            ? run(true)
            // 取消覆盖
            : ({ isCancel: true })
        )
        .catch(catchAndThrow)
}

/**
 * 读取模板，编译模板，生成文件
 * @param {String} src 模板地址
 * @param {String} dist 目标地址
 * @param {Object} meta 元数据
 * @param {Boolean} isCover 是否直接覆盖
 */
const compileTmplToTarget = ({
    src,
    dist,
    meta = {},
    isCover = false,
}) => {
    const run = (isCover) => readFile(src)
        .then(content => content.toString())
        .then(content => Handlebars.compile(content)(meta))
        .then(result => writeFile(dist, result))
        // 是否已覆盖该文件
        .then(() => ({ isCover }))

    return promptAndRun({
        run,
        isCover,
        message: 'Target file exists. Continue?',
        targetPath: dist,
    })
}

module.exports = {
    promptAndRun,
    compileTmplToTarget,
}

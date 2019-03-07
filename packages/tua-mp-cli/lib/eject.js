const path = require('path')
const { copy } = require('fs-extra')

const {
    log,
    rMkdir,
    promptAndRun,
} = require('./utils')

const cwd = process.cwd()

/**
 * 拷贝复制 templates/ 到项目中的 .templates/ 中
 */
module.exports = () => {
    const src = '../templates/'
    const dist = '.templates/'

    const sourcePath = process.env.TUA_CLI_TEST_SRC ||
        /* istanbul ignore next */
        path.resolve(__dirname, src)
    const targetPath = process.env.TUA_CLI_TEST_DIST ||
        /* istanbul ignore next */
        path.resolve(cwd, dist)

    const run = (isCover = false) => copy(sourcePath, targetPath)
        .then(() => {
            log(`成功${isCover ? '覆盖' : '导出'}模板 -> ${dist}\n`)
        })

    return promptAndRun({
        run,
        message: 'Target directory exists. Continue?',
        beforeFn: () => rMkdir(targetPath),
        targetPath,
    })
}

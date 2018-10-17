// 新增页面

exports.desc = 'add a page for your project'
exports.aliases = 'p'
exports.command = 'page <name>'

exports.builder = {}

exports.handler = (argv) => {
    const name = argv.name

    require('../../lib/addPage')(name)
}

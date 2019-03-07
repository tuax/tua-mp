// 新增 api

exports.desc = 'add an api for your project'
exports.aliases = 'a'
exports.command = 'api <name>'
exports.builder = {}

exports.handler = (argv) => {
    const name = argv.name
    const { readConfigFile } = require('../../lib/utils/')

    require('../../lib/addApi')(name, readConfigFile())
}

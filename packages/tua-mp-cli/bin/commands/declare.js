const { readConfigFile } = require('../../lib/utils/')

exports.desc = 'generate api declaration file by [apisPath]'
exports.aliases = 'd'
exports.command = 'declare [apisPath]'

exports.builder = {}

exports.handler = (argv) => {
    argv.tuaConfig = readConfigFile()

    return require('../../lib/declare')(argv)
}

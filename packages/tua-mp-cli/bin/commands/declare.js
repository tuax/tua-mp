const { readConfigFile } = require('../../lib/utils/')

exports.desc = 'generate api declaration file by [apisPath]'
exports.aliases = 'd'
exports.command = 'declare [apisPath]'

exports.builder = (yargs) => yargs
    .option('yes', {
        type: 'boolean',
        alias: 'y',
        default: false,
        describe: 'overwrite existing index.d.ts',
    })

exports.handler = (argv) => {
    argv.tuaConfig = readConfigFile()

    return require('../../lib/declare')(argv)
}

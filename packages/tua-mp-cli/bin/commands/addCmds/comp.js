// 新增组件

exports.desc = 'add a component for your project'
exports.aliases = 'c'
exports.command = 'comp <name>'

exports.builder = (yargs) => yargs
    .option('global', {
        type: 'boolean',
        alias: 'g',
        default: false,
        describe: 'add a global component in src/comps/',
    })

exports.handler = require('../../../lib/addComp')

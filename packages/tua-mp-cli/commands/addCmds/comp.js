// 新增组件

exports.desc = 'add a component for your project'
exports.aliases = 'c'
exports.command = 'comp <name>'

exports.builder = (yargs) => yargs
    .option('global', {
        alias: 'g',
        default: false,
        describe: 'add a global component in src/comps/',
    })

exports.handler = (argv) => {
    const name = argv.name
    const global = argv.global

    require('../../lib/addComp')({ name, global })
}

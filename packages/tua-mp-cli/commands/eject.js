exports.desc = 'eject default templates into your project'
exports.aliases = 'e'
exports.command = 'eject'

exports.builder = {}

exports.handler = () => {
    require('../lib/eject')()
}

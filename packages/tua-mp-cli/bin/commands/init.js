// 初始化项目（代理 vue-cli v2 的 init）

exports.desc = 'init project by vue-cli v2'
exports.aliases = 'i'
exports.command = 'init <template> <name>'

exports.builder = {}

exports.handler = () => { require('@vue/cli-init') }

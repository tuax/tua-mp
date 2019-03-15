// 新增 api

exports.desc = 'add an api for your project'
exports.aliases = 'a'
exports.command = 'api <name>'

exports.builder = {}

exports.handler = require('../../../lib/addApi')

exports.desc = 'generate api declaration file by [apisPath]'
exports.aliases = 'd'
exports.command = 'declare [apisPath]'

exports.builder = {}

exports.handler = require('../../lib/declare')

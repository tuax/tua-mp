#!/usr/bin/env node

const semver = require('semver')

const packageJson = require('../package.json')

const {
    name: projectName,
    engines: { node: requiredVersion },
} = packageJson

// 检查 node 版本
if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
        `You are using Node ${process.version}, but ${projectName} ` +
        `requires Node ${requiredVersion}.` +
        `Please upgrade your Node version.`
    )
    process.exit(1)
}

require('yargs')
    .alias('v', 'version')
    .alias('h', 'help')
    // 命令目录
    .commandDir('../commands/')
    .demandCommand(1)
    .parse()

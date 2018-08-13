#!/usr/bin/env node

const semver = require('semver')
const program = require('commander')

const addApi = require('../lib/addApi')
const addComp = require('../lib/addComp')
const addPage = require('../lib/addPage')
const packageJson = require('../package.json')

const {
    name: projectName,
    version: projectVersion,
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

// 版本信息
program
    .version(projectVersion, '-v, --version')
    .usage('<command> [options]')

// 初始化项目，代理 vue-cli v2
program
    .command('init <template> <name>')
    .description('通过模板新建项目（可以使用远程或本地模板）')
    .option('-c, --clone', '使用 git clone')
    .option('--offline', '使用缓存的模板')
    .action(() => { require('@vue/cli-init') })

// 新增 api
program
    .command('add:api <name>')
    .description('新增 api')
    // TODO
    // .option('--custom', '使用自定义模板')
    .action(addApi)

// 新增页面
program
    .command('add:page <name>')
    .description('新增页面')
    // TODO
    // .option('--custom', '使用自定义模板')
    .action(addPage)

// 新增组件
program
    .command('add:comp <name>')
    .description('新增组件')
    .option('-g, --global', '添加全局组件')
    // TODO
    // .option('--custom', '使用自定义模板')
    .action(addComp)

// 开始执行
program.parse(process.argv)

// 展示帮助
if (!process.argv.slice(2).length) {
    program.outputHelp()
}

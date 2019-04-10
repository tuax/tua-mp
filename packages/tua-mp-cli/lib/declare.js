const fs = require('fs')
const path = require('path')

const {
    log,
    error,
    writeFile,
    promptAndRun,
    catchAndThrow,
} = require('./utils')
const { defaultTuaConfig } = require('./constants')

const cwd = process.cwd()

/**
 * 根据导出的 apis，生成相应的 index.d.ts 声明
 * @param {Object} options
 * @param {String} options.apisPath 导出 apis 对象的文件地址
 * @param {Object} options.tuaConfig 项目自定义配置
 */
module.exports = (options = {}) => {
    /* istanbul ignore next */
    const {
        apisPath = 'src/apis/index.js',
        tuaConfig: {
            alias = defaultTuaConfig.alias,
        } = defaultTuaConfig,
    } = options

    const sourcePath = process.env.TUA_CLI_TEST_SRC ||
        /* istanbul ignore next */
        path.resolve(cwd, apisPath)

    try {
        mockGlobalVars()

        const isDir = fs.lstatSync(sourcePath).isDirectory()

        const dir = isDir ? apisPath : path.dirname(apisPath)
        const name = isDir ? `index` : path.basename(apisPath, path.extname(apisPath))
        const dist = `${dir}/${name}.d.ts`
        const relativePath = path.relative(cwd, dist)
        const targetPath = process.env.TUA_CLI_TEST_DIST ||
            /* istanbul ignore next */
            path.resolve(cwd, dist)

        require('@babel/register')({
            plugins: [
                [require('babel-plugin-module-resolver'), { root: cwd, alias }],
            ],
        })

        // get apis
        const apis = require(sourcePath)
        const code = genApiDeclarationCode(apis)
        const run = (isCover = false) => writeFile(targetPath, code)
            .then(() => {
                log(`成功${isCover ? '覆盖' : '生成'} api 声明 -> ${relativePath}\n`)
            })
        const message = 'Target file exists. Continue?'

        return promptAndRun({ run, message, targetPath })
    } catch (e) {
        error(`Error loading ${sourcePath}:`)

        return catchAndThrow(e)
    }
}

// mock global vars
function mockGlobalVars () {
    const location = {
        hash: '',
        host: '',
        href: '',
        port: '',
        origin: '',
        search: '',
        hostname: '',
        protocol: '',
        pathname: '',
    }
    const navigator = {
        appName: '',
        platform: '',
        userAgent: '',
        appCodeName: '',
    }

    global.wx = global.wx || {}
    global.window = global.window || { location, navigator }
    global.location = global.location || location
    global.navigator = global.navigator || navigator
}

/**
 * 根据 api config 生成 api 函数声明代码
 * @param {object} apis 属性为 tua-api 生成的请求对象
 */
function genApiDeclarationCode (apis) {
    // 接口响应的类型声明
    const interfaceCode = `interface result { code: number, data: any }\n\n`

    // 各个 api 生成的声明代码
    const apiCode = Object.keys(apis)
        .map(key => `export declare namespace ${key} {\n\t${genApiFnsCode(apis[key])}\n}`)
        .join(`\n\n`)

    return interfaceCode + apiCode

    /**
     * 生成单个 api 下各个函数的声明代码
     * @param {Object} api tua-api 生成的请求对象
     */
    function genApiFnsCode (api) {
        return Object.keys(api)
            .map((fnKey) => {
                const attrsCode = genAttrsCode(api[fnKey].params)
                const paramsCode = attrsCode ? `params: {\n\t\t${attrsCode}\n\t}` : ``

                return `export const ${fnKey}: <T = result>(${paramsCode}) => Promise<T>`
            })
            .join(`\n\t`)
    }

    /**
     * 生成参数声明代码
     * @param {Object|Array} params 接口参数配置
     */
    function genAttrsCode (params = []) {
        const attrsCodeArr = Array.isArray(params)
            // 数组形式的参数都认为是可选的
            ? params.map(key => `${key}?: string | number,`)
            : Object.keys(params).map((key) => {
                const param = params[key]
                const isRequired = param.required || param.isRequired
                return `${key}${isRequired ? '' : '?'}: string | number,`
            })

        return attrsCodeArr.join(`\n\t\t`)
    }
}

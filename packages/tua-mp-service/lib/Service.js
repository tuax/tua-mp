const fs = require('fs')
const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const WebpackChain = require('webpack-chain')
const {
    map,
    pipe,
    warn,
    error,
    filter,
    flatten,
    compose,
    mergeAll,
    isDirectory,
    fsExistsFallback,
} = require('./utils')

const webpackConfig = new WebpackChain()
const VALID_COMMENDS = ['build', 'serve']

module.exports = class Service {
    constructor (context) {
        this.context = context
        this.webpackChainFns = []
        this.webpackRawConfigFns = []

        this.init()
    }

    // 执行编译
    run (name = 'build') {
        name = name.toLowerCase()

        if (VALID_COMMENDS.indexOf(name) === -1) {
            warn(
                `INVALID command [${name}]!!!` +
                `valid commands are: ${VALID_COMMENDS.join(', ')}`
            )
            name = 'build'
        }

        const isDev = name === 'serve'
        process.env.NODE_ENV = isDev ? 'development' : 'production'

        const config = this.resolveWebpackConfig()

        return new Promise((resolve, reject) => {
            webpack(config, (err, stats) => {
                if (err) {
                    error(err)
                    reject(err)
                }

                if (stats.hasErrors()) {
                    error(`Build failed with errors.`)
                    reject(stats.toJson().errors)
                }

                resolve(stats.toString(config.stats))
            })
        })
    }

    init () {
        this.loadConfigs()
        this.genTools()
        this.projectOptions = this.loadUserOptions()

        if (this.projectOptions.chainWebpack) {
            this.webpackChainFns.push(this.projectOptions.chainWebpack)
        }

        if (this.projectOptions.configureWebpack) {
            this.webpackRawConfigFns.push(this.projectOptions.configureWebpack)
        }

        if (this.projectOptions.enableEslint) {
            this.webpackChainFns.push((webpackConfig) => {
                // eslint
                webpackConfig.module.rule('eslint')
                    .test(/\.(js|vue)$/)
                    .pre()
                    .include.add(this.tools.resolve('src')).end()
                    .use('eslint-loader').loader('eslint-loader')
                    .options({
                        formatter: require('eslint-friendly-formatter'),
                    })
            })
        }
    }

    // 读取 configs/ 下的配置
    loadConfigs () {
        const configs = require('./configs/')

        Object.keys(configs)
            .map(key => configs[key])
            .forEach(fn => this.webpackChainFns.push(fn))
    }

    // 读取用户配置
    loadUserOptions () {
        const TUA_FILE_NAME = 'tua.config.js'
        const TUA_MP_FILE_NAME = 'tua-mp.config.js'

        const tuaConfigPath = this.tools.resolve(TUA_FILE_NAME)
        const tuaMpConfigPath = this.tools.resolve(TUA_MP_FILE_NAME)

        if (fsExistsFallback([tuaMpConfigPath])) {
            warn(
                `"${TUA_MP_FILE_NAME}" is DEPRECATED.\n` +
                `Please rename it to "${TUA_FILE_NAME}" instead.`
            )
        }

        const configPath = fsExistsFallback([
            tuaConfigPath,
            tuaMpConfigPath,
        ])

        if (!configPath) return {}

        try {
            const fileConfig = require(configPath)

            if (!fileConfig || typeof fileConfig !== 'object') {
                error(`Error loading ${configPath}: should export an object.`)
                return {}
            }

            return fileConfig
        } catch (e) {
            error(`Error loading ${configPath}:`)
            throw e
        }
    }

    // 合并用户配置的 webpack
    resolveWebpackConfig () {
        this.webpackChainFns.forEach((fn) => {
            fn(webpackConfig, this.tools)
        })

        let config = webpackConfig.toConfig()

        this.webpackRawConfigFns.forEach((fn) => {
            if (typeof fn === 'function') {
                const res = fn(config)
                if (res) {
                    config = merge(config, res)
                }
            } else if (fn) {
                config = merge(config, fn)
            }
        })

        return config
    }

    genTools () {
        // 绑定了 this.context 的 resolve
        const resolve = (...urls) => path.resolve(this.context, ...urls)

        // 获取从 url 到 src/ 的相对路径
        const getRelativePath = (url) => [
            path.relative(resolve('src'), url),
            url.split(path.sep).pop(),
        ].join(path.sep)

        // 由 url 获取最终的 entry 对象
        const getNameUrlObj = (url) => {
            // 入口是 index.js
            if (fs.existsSync(resolve(url, 'index.js'))) {
                return { [getRelativePath(url)]: [url] }
            }

            // 入口是和文件夹同名的 js
            const last = url.split(path.sep).pop()
            if (fs.existsSync(resolve(url, `${last}.js`))) {
                return { [getRelativePath(url)]: [url + path.sep + last] }
            }

            return null
        }

        /**
         * 过滤出 base 下的文件夹的名称 dir 和绝对路径 url
         * @param {String} base 基础路径 pages|comps
         * @return {Array} 含有 dir 和 url 的数组
         */
        const getDirArr = (base) => fs
            .readdirSync(resolve('src', base))
            .map(dir => resolve('src', base, dir))
            .filter(isDirectory)

        // 获取拍平后的子目录数组
        const getSubDirArr = pipe(
            map(getDirArr),
            flatten
        )

        /**
         * 通过 base 下的文件夹名称，生成类似
         * pages/index/index
         * comps/TuaImage/TuaImage
         * 这样的路径作为 name，以便后续生成对应路径上的 js 和 wxss
         * @param {String} base 基础路径 pages|comps
         * @return {Object} 对象形式的 entry
         */
        const getEntryByDir = pipe(
            getDirArr,
            map(getNameUrlObj),
            filter(x => x),
            mergeAll
        )

        /**
         * 对于页面 foo 下的页面级组件 bar，
         * 生成类似 pages/foo/comps/bar/ 这样的入口
         * @return {Object} 对象形式的 entry
         */
        const getPagesCompsEntry = pipe(
            getDirArr,
            getSubDirArr,
            getSubDirArr,
            map(getNameUrlObj),
            filter(x => x),
            mergeAll
        )

        // 由后缀和完整文件路径，得到对应输出路径，用于 file-loader 输出文件
        const getNameByFilePath = compose(
            getRelativePath,
            path.dirname
        )

        this.tools = {
            resolve,
            getEntryByDir,
            getNameByFilePath,
            getPagesCompsEntry,
        }
    }
}

import WebpackBar from 'webpackbar'
import WebpackChain from 'webpack-chain'
import { BannerPlugin } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import EslintFriendlyFormatter from 'eslint-friendly-formatter'
import {
    resolve,
    getEntryByDir,
    getNameByFilePath,
    getPagesCompsEntry,
} from './webpackUtils'

const webpackConfig = new WebpackChain()

export default ({ isDev }) => {
    webpackConfig
        .mode(isDev ? 'development' : 'production')
        .stats(isDev ? 'none' : {
            colors: true,
            chunks: false,
            modules: false,
            children: false,
            chunkModules: false
        })
        .devtool(isDev && 'source-map')

    // entry
    webpackConfig
        .merge({
            entry: {
                // pages 页面入口
                ...getEntryByDir('pages'),
                // comps 组件入口
                ...getEntryByDir('comps'),
                // 页面级组件入口
                ...getPagesCompsEntry('pages'),
            },
        })
        // app 应用入口
        .entry('app').add('./src/app/app').end()

    // output
    webpackConfig.output
        .path(resolve('dist'))
        .filename(`[name].js`)
        .globalObject('global')

    // babel
    webpackConfig.module.rule('babel')
        .test(/\.js$/)
        .exclude
            .add(/node_modules/)
            .end()
        .use('babel')
            .loader('babel-loader')

    // eslint
    webpackConfig.module.rule('eslint')
        .test(/\.js$/)
        .pre()
        .include
            .add(resolve('src'))
            .end()
        .use('eslint')
            .loader('eslint-loader')
            .options({
                formatter: EslintFriendlyFormatter,
            })

    // 样式
    const addExtract = (cfg) => cfg
        .use('extract').loader(MiniCssExtractPlugin.loader).end()
        .use('css').loader('css-loader').end()

    addExtract(webpackConfig.module.rule('css').test(/\.css$/))
    addExtract(webpackConfig.module.rule('less').test(/\.less$/))
        .use('less').loader('less-loader').end()
    addExtract(webpackConfig.module.rule('scss').test(/\.s[ac]ss$/))
        .use('scss').loader('sass-loader').end()
    addExtract(webpackConfig.module.rule('stylus').test(/\.styl$/))
        .use('stylus').loader('stylus-loader').end()

    // 文件扩展名
    ;['.js', '.json'].forEach((ext) => {
        webpackConfig.resolve.extensions.add(ext)
    })

    // 别名
    webpackConfig.resolve.alias
        .set('@', resolve('src'))
        .set('@utils', resolve('src/scripts/utils'))
        .set('@const', resolve('src/scripts/constants'))

    // 提取公共依赖
    webpackConfig.optimization
        // webpack runtime
        .runtimeChunk({ name: 'chunks/runtime' })
        .splitChunks({
            cacheGroups: {
                // npm 包
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunks/vendors',
                    chunks: 'all',
                },
                // 项目公共函数
                scripts: {
                    test: /[\\/]src[\\/](apis|scripts)[\\/]/,
                    name: 'chunks/scripts',
                    chunks: 'all',
                    // 强制提取
                    enforce: true,
                },
            },
        })

    // plugins
    webpackConfig
        .plugin('FriendlyErrors').use(FriendlyErrorsPlugin).end()
        .plugin('WebpackBar')
            .use(WebpackBar, [{
                profile: !isDev,
                compiledIn: false
            }])
            .end()
        .plugin('MiniCssExtract')
            .use(MiniCssExtractPlugin, [{
                filename: `[name].wxss`,
            }])
            .end()
        .plugin('CopyWebpack')
            .use(CopyWebpackPlugin, [
                getCopyCfgArr(),
                { context: resolve('src') },
            ])
            .end()
        .plugin('BannerPlugin')
            .use(BannerPlugin, [{
                raw: true,
                // 因为无法通过 html 的 script 标签插入
                // 所以只好在入口文件 app.js 前插入公共依赖
                banner: `try {` +
                    `require('./chunks/runtime');` +
                    `require('./chunks/vendors');` +
                    `require('./chunks/scripts');` +
                `} catch (e) {}`,
                include: 'app.js',
            }])
            .end()

    return webpackConfig.toConfig()
}

const getCopyCfg = (base, ext) => ({
    from: `${base}/**/*${ext}`,
    to: `[path]/[name]${ext}`,
})
const PROJECT_CFG = 'project.config.json'
// 需要从 src 拷到 dist 的文件
const getCopyCfgArr = () => [
    // 图片
    { from: 'assets/', to: 'assets/' },
    // 模板
    { from: 'templates/', to: 'templates/' },
    // 配置
    { from: 'app/app.json', to: 'app.json' },
    // 开发者工具配置
    { from: `../${PROJECT_CFG}`, to: PROJECT_CFG },
    // pages
    getCopyCfg('pages', '.wxml'),
    getCopyCfg('pages', '.json'),
    // comps
    getCopyCfg('comps', '.wxml'),
    getCopyCfg('comps', '.json'),
]

module.exports = (webpackConfig, { resolve }) => {
    const isDev = process.env.NODE_ENV === 'development'

    // plugins
    webpackConfig
        .plugin('VueLoaderPlugin')
        .use(require('vue-loader/lib/plugin'))

    webpackConfig
        .plugin('webpackbar')
        .use(require('webpackbar'), [{
            profile: !isDev,
            compiledIn: false,
        }])
        .before('FriendlyErrorsPlugin')

    // friendly error plugin displays very confusing errors when webpack
    // fails to resolve a loader, so we provide custom handlers to improve it
    const {
        formatter,
        transformer,
    } = require('../resolveLoaderError')
    webpackConfig
        .plugin('friendly-errors-webpack-plugin')
        .use(require('friendly-errors-webpack-plugin'), [{
            additionalTransformers: [transformer],
            additionalFormatters: [formatter],
        }])

    webpackConfig
        .plugin('mini-css-extract-plugin')
        .use(require('mini-css-extract-plugin'), [{
            filename: `[name].wxss`,
        }])

    webpackConfig
        .plugin('copy-webpack-plugin')
        .use(require('copy-webpack-plugin'), [
            getCopyCfgArr(),
            { context: resolve('src') },
        ])

    webpackConfig
        .plugin('BannerPlugin')
        .use(require('webpack').BannerPlugin, [{
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
}

const getCopyCfg = (base, ext) => ({
    from: `${base}/**/*${ext}`,
    to: `[path]/[name]${ext}`,
})
// 需要从 src 拷到 dist 的文件
const getCopyCfgArr = () => [
    // 图片
    { from: 'assets/', to: 'assets/' },
    // 模板
    { from: 'templates/', to: 'templates/' },
    // 配置
    { from: 'app/app.json', to: 'app.json' },
    // pages
    getCopyCfg('pages', '.wxml'),
    getCopyCfg('pages', '.json'),
    // comps
    getCopyCfg('comps', '.wxml'),
    getCopyCfg('comps', '.json'),
]

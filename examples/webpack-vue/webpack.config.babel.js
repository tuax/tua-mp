import WebpackBar from 'webpackbar'
import { BannerPlugin } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import EslintFriendlyFormatter from 'eslint-friendly-formatter'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import {
    resolve,
    getEntryByDir,
    getNameByFilePath,
    getPagesCompsEntry,
} from './webpackUtils'

export default ({ isDev }) => ({
    mode: isDev ? 'development' : 'production',
    stats: isDev ? 'none' : {
        colors: true,
        chunks: false,
        modules: false,
        children: false,
        chunkModules: false
    },
    devtool: isDev && 'source-map',
    entry: {
        // app 应用入口
        app: './src/app/app',
        // pages 页面入口
        ...getEntryByDir('pages'),
        // comps 组件入口
        ...getEntryByDir('comps'),
        // 页面级 comps 组件入口
        ...getPagesCompsEntry('pages'),
    },
    output: {
        filename: `[name].js`,
        path: resolve('dist'),
        globalObject: 'global',
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src')],
                options: {
                    formatter: EslintFriendlyFormatter,
                },
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
                options: {
                    compiler: {
                        // mock vue-template-compiler
                        compile: () => ({
                            staticRenderFns: [],
                        }),
                    },
                },
            },
            {
                // 处理 <config>{...}</config> 代码块
                // 生成 .json 文件
                resourceQuery: /blockType=config/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: file => getNameByFilePath(file) + '.json',
                    },
                },
            },
            {
                // 处理 <template lang="wxml">{...}</template>
                // 生成 .wxml 文件
                test: /\.wxml$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: file => getNameByFilePath(file) + '.wxml',
                    },
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'less-loader',
                    ],
                }),
            },
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader',
                    ],
                }),
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'stylus-loader',
                    ],
                }),
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
            '@const': resolve('src/scripts/const'),
            '@utils': resolve('src/scripts/utils'),
        },
    },
    // 提取公共依赖
    optimization: {
        runtimeChunk: {
            name: 'chunks/runtime'
        },
        splitChunks: {
            cacheGroups: {
                // npm 包
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunks/vendors',
                    chunks: 'all',
                },
                // 项目公共函数
                scripts: {
                    test: /[\\/]src[\\/]scripts[\\/]/,
                    name: 'chunks/scripts',
                    chunks: 'all',
                    // 强制提取
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new WebpackBar({
            profile: !isDev,
            compiledIn: false,
        }),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin(getCopyCfgArr(), {
            context: resolve('src'),
        }),
        new ExtractTextPlugin('[name].wxss'),
        new FriendlyErrorsPlugin(),
        new BannerPlugin({
            raw: true,
            // 因为无法通过 html 的 script 标签插入
            // 所以只好在入口文件 app.js 前插入公共依赖
            banner: `require('./chunks/runtime');` +
                `require('./chunks/vendors');` +
                `require('./chunks/scripts');`,
            include: 'app.js',
        })
    ],
})

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
    // widget
    getCopyCfg('searchWidget', '.js'),
]

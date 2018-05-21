import fs from 'fs'
import path from 'path'
import vueLoaderConfig from './vue-loader.conf'
import { BannerPlugin } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import EslintFriendlyFormatter from 'eslint-friendly-formatter'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'

import { pages } from './src/app/app.json'

const resolve = (...dir) => path.resolve(__dirname, ...dir)

// 从 src/ 直接拷贝到 dist/
const fromPrefix = 'src/pages/*/*'
const toPrefix = 'pages/[name]/[name]'
const copyCfgArr = [
    { from: 'src/assets', to: 'assets' },
    { from: 'src/app/app.json', to: 'app.json' },
    { from: `${fromPrefix}.wxml`, to: `${toPrefix}.wxml` },
    { from: `${fromPrefix}.json`, to: `${toPrefix}.json` },
    { from: `${fromPrefix}.wxss`, to: `${toPrefix}.wxss` },
]

// 页面入口
const pagesEntry = pages
    .map((page) => ({
        [page]: resolve('src', page),
    }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {})

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
        ...pagesEntry,
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
                    loaders: vueLoaderConfig.cssLoaders({
                        sourceMap: false,
                        extract: true,
                        debug: isDev,
                    }),
                    compiler: {
                        // mock vue-template-compiler
                        compile: () => ({
                            staticRenderFns: [],
                        })
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
                        name: `[name].json`,
                        useRelativePath: true,
                        context: resolve('src'),
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
                        name: `[name].wxml`,
                        useRelativePath: true,
                        context: resolve('src'),
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
    watchOptions: {
        aggregateTimeout: 300,
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
        new VueLoaderPlugin(),
        new CopyWebpackPlugin(copyCfgArr),
        new ExtractTextPlugin('[name].wxss'),
        new FriendlyErrorsWebpackPlugin(),
        new BannerPlugin({
            raw: true,
            // 因为无法通过 html 的 script 标签插入
            // 所以只好在入口文件 app.js 前插入公共依赖
            banner: `require('./chunks/runtime');require('./chunks/vendors');require('./chunks/scripts');`,
            include: 'app.js',
        })
    ],
})

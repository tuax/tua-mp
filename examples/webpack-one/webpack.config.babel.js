import fs from 'fs'
import path from 'path'
import { BannerPlugin } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import EslintFriendlyFormatter from 'eslint-friendly-formatter'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'

import { pages } from './src/app.json'

const resolve = (...dir) => path.resolve(__dirname, ...dir)

// 从 src/ 直接拷贝到 dist/
const fromPrefix = 'src/pages/*/*'
const toPrefix = 'pages/[name]/[name]'
const copyCfgArr = [
    { from: 'src/assets', to: 'assets' },
    { from: 'src/app.json', to: 'app.json' },
    { from: 'src/app.wxss', to: 'app.wxss' },
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
        app: './src/app',
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
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src')],
                options: {
                    formatter: EslintFriendlyFormatter,
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')],
            },
        ],
    },
    resolve: {
        alias: {
            '@': resolve('src'),
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
                utils: {
                    test: /[\\/]src[\\/]utils[\\/]/,
                    name: 'chunks/utils',
                    chunks: 'all',
                    // 强制提取
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new CopyWebpackPlugin(copyCfgArr),
        new FriendlyErrorsWebpackPlugin(),
        new BannerPlugin({
            raw: true,
            // 因为无法通过 html 的 script 标签插入
            // 所以只好在入口文件 app.js 前插入公共依赖
            banner: `require('./chunks/runtime');require('./chunks/vendors');require('./chunks/utils');`,
            include: 'app.js',
        })
    ],
})

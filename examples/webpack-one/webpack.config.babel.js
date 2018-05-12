import fs from 'fs'
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import EslintFriendlyFormatter from 'eslint-friendly-formatter'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'

import { pages } from './src/app.json'

const resolve = (...dir) => path.resolve(__dirname, ...dir)

// 从 src/ 直接拷贝到 dist/
const fromPrefix = 'src/pages/*/*'
const toPrefix = 'pages/[name]/[name]'
const copyCfgArr = [
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
        modules: false,
        children: false,
        chunks: false,
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
                }
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
    plugins: [
        new CopyWebpackPlugin(copyCfgArr),
        new FriendlyErrorsWebpackPlugin(),
    ],
    watchOptions: {
        aggregateTimeout: 300,
    },
})

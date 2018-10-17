const getConfig = require('../../lib/configs/prod')
const WebpackChain = require('webpack-chain')

const webpackConfig = new WebpackChain()

test('prod', () => {
    getConfig(webpackConfig)
    expect(webpackConfig.toConfig()).toEqual({})

    const preENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    getConfig(webpackConfig)

    const {
        mode,
        stats,
        devtool,
    } = webpackConfig.toConfig()

    expect(mode).toBe('production')
    expect(devtool).toBe(false)
    expect(JSON.stringify(stats)).toBe(JSON.stringify({
        colors: true,
        chunks: false,
        modules: false,
        children: false,
        entrypoints: false,
        chunkModules: false,
    }))
    expect(stats.excludeAssets('a.js')).toBe(false)
    expect(stats.excludeAssets('a.json')).toBe(true)
    expect(stats.excludeAssets('a.wxml')).toBe(true)
    expect(stats.excludeAssets('a.png')).toBe(true)

    process.env.NODE_ENV = preENV
})

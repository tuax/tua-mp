const getConfig = require('../../lib/configs/dev')
const WebpackChain = require('webpack-chain')

const webpackConfig = new WebpackChain()

test('dev', () => {
    getConfig(webpackConfig)
    expect(webpackConfig.toConfig()).toEqual({})

    const preENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    getConfig(webpackConfig)

    expect(webpackConfig.toConfig()).toEqual({
        watch: true,
        mode: 'development',
        stats: 'none',
        devtool: 'source-map'
    })

    process.env.NODE_ENV = preENV
})

const getConfig = require('../../lib/configs/module')
const WebpackChain = require('webpack-chain')

const webpackConfig = new WebpackChain()

test('module', () => {
    getConfig(webpackConfig)

    const {
        module: { rules },
    } = webpackConfig.toConfig()

    expect(rules).toEqual([
        {
            test: /\.js$/,
            exclude: [ /node_modules/ ],
            use: [{ loader: 'babel-loader' }],
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            }],
        },
        {
            test: /\.(eot|ttf|wav|mp3)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            }],
        },
    ])
})

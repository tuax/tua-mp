const loader = require('mini-css-extract-plugin').loader
const getConfig = require('../../lib/configs/module.style')
const WebpackChain = require('webpack-chain')

const webpackConfig = new WebpackChain()

test('module.style', () => {
    getConfig(webpackConfig)

    const {
        module: { rules },
    } = webpackConfig.toConfig()

    expect(rules[0]).toEqual({
        test: /\.css$/,
        use: [
            { loader },
            { loader: 'css-loader' },
        ],
    })
    expect(rules[1]).toEqual({
        test: /\.less$/,
        use: [
            { loader },
            { loader: 'css-loader' },
            { loader: 'less-loader' },
        ],
    })
    expect(rules[2]).toEqual({
        test: /\.s[ac]ss$/,
        use: [
            { loader },
            { loader: 'css-loader' },
            { loader: 'sass-loader', options: { implementation: require('sass') } },
        ],
    })
    expect(rules[3]).toEqual({
        test: /\.styl$/,
        use: [
            { loader },
            { loader: 'css-loader' },
            { loader: 'stylus-loader' },
        ],
    })
})

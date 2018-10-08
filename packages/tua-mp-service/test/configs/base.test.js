const getConfig = require('../../lib/configs/base')
const WebpackChain = require('webpack-chain')

const webpackConfig = new WebpackChain()

test('base', () => {
    getConfig(webpackConfig, {
        resolve: x => x,
        getEntryByDir: x => ({ [`d_${x}`]: [x] }),
        getPagesCompsEntry: x => ({ [`pc_${x}`]: [x] }),
    })

    const {
        entry,
        output,
        resolve: {
            alias,
            extensions,
        },
        optimization: {
            runtimeChunk,
            splitChunks: {
                cacheGroups: {
                    vendors,
                    scripts,
                },
            },
        },
    } = webpackConfig.toConfig()

    expect(entry).toEqual({
        app: [ './src/app' ],
        d_comps: [ 'comps' ],
        d_pages: [ 'pages' ],
        pc_pages: [ 'pages' ],
    })

    expect(output).toEqual({
        path: 'dist',
        filename: '[name].js',
        globalObject: 'global',
    })

    expect(alias).toEqual({
        '@': 'src',
        '@utils': 'src/scripts/utils',
        '@const': 'src/scripts/constants',
    })

    expect(extensions).toEqual([ '.js', '.vue', '.json' ])

    expect(runtimeChunk).toEqual({
        name: 'chunks/runtime',
    })

    expect(vendors).toEqual({
        test: /[\\/]node_modules[\\/]/,
        name: 'chunks/vendors',
        chunks: 'all',
    })

    expect(scripts).toEqual({
        test: /[\\/]src[\\/](apis|scripts)[\\/]/,
        name: 'chunks/scripts',
        chunks: 'all',
        enforce: true,
    })
})

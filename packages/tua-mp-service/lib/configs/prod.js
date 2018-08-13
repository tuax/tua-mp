module.exports = (webpackConfig) => {
    if (process.env.NODE_ENV !== 'production') return

    webpackConfig
        .mode('production')
        .stats({
            colors: true,
            chunks: false,
            modules: false,
            children: false,
            entrypoints: false,
            chunkModules: false,
            excludeAssets: str => !/\.js$/.test(str),
        })
        .devtool(false)
}

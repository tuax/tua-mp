module.exports = (webpackConfig) => {
    if (process.env.NODE_ENV !== 'development') return

    webpackConfig
        .watch(true)
        .mode('development')
        .stats('none')
        .devtool('source-map')
}

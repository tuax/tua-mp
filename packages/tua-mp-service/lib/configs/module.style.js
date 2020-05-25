module.exports = (webpackConfig) => {
    // 样式
    const addExtract = (cfg) => cfg
        .use('mini-css-extract-plugin')
        .loader(require('mini-css-extract-plugin').loader)
        .end()
        .use('css-loader').loader('css-loader').end()

    addExtract(webpackConfig.module.rule('css').test(/\.css$/))
    addExtract(webpackConfig.module.rule('less').test(/\.less$/))
        .use('less-loader').loader('less-loader').end()
    addExtract(webpackConfig.module.rule('scss').test(/\.s[ac]ss$/))
        .use('scss-loader').loader('sass-loader').options({ implementation: require('sass') }).end()
    addExtract(webpackConfig.module.rule('stylus').test(/\.styl$/))
        .use('stylus-loader').loader('stylus-loader').end()
}

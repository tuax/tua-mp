module.exports = (webpackConfig) => {
    // babel
    webpackConfig.module.rule('babel')
        .test(/\.js$/)
        .exclude
        .add(/node_modules/)
        .end()
        .use('babel')
        .loader('babel-loader')

    // 图片转成 base64
    webpackConfig.module.rule('image')
        .test(/\.(png|jpg|jpeg|gif|svg|woff|woff2)$/)
        .use('url')
        .loader('url-loader')
        .options({
            name: '[path][name].[ext]',
        })

    // 文件加载器，处理文件静态资源
    webpackConfig.module.rule('assets')
        .test(/\.(eot|ttf|wav|mp3)$/)
        .use('assets')
        .loader('file-loader')
        .options({ name: '[path][name].[ext]' })
}

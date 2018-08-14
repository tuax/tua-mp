module.exports = (webpackConfig, {
    resolve,
    getEntryByDir,
    getPagesCompsEntry,
}) => {
    // entry
    webpackConfig
        .merge({
            entry: {
                // pages 页面入口
                ...getEntryByDir('pages'),
                // comps 组件入口
                ...getEntryByDir('comps'),
                // 页面级组件入口
                ...getPagesCompsEntry('pages'),
            },
        })
        // app 应用入口
        .entry('app').add(resolve('./src/app')).end()

    // output
    webpackConfig.output
        .path(resolve('dist'))
        .filename(`[name].js`)
        .globalObject('global')

    // 文件扩展名
    webpackConfig.resolve.extensions
        .merge(['.js', '.vue', '.json'])

    // 别名
    webpackConfig.resolve.alias
        .set('@', resolve('src'))
        .set('@utils', resolve('src/scripts/utils'))
        .set('@const', resolve('src/scripts/constants'))

    // 提取公共依赖
    webpackConfig.optimization
        // webpack runtime
        .runtimeChunk({ name: 'chunks/runtime' })
        .splitChunks({
            cacheGroups: {
                // npm 包
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunks/vendors',
                    chunks: 'all',
                },
                // 项目公共函数
                scripts: {
                    test: /[\\/]src[\\/](apis|scripts)[\\/]/,
                    name: 'chunks/scripts',
                    chunks: 'all',
                    // 强制提取
                    enforce: true,
                },
            },
        })
}

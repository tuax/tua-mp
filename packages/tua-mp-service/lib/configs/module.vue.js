module.exports = (webpackConfig, { resolve, getNameByFilePath }) => {
    // .vue
    webpackConfig.module.rule('vue')
        .test(/\.vue$/)
        .exclude.add(/node_modules/).end()
        .use('vue-loader').loader('vue-loader')
        .options({
            compiler: {
                // mock vue-template-compiler
                compile: () => ({
                    staticRenderFns: [],
                }),
                parseComponent: require('vue-template-compiler')
                    .parseComponent,
            },
        })

    // 处理 <config>{...}</config> 代码块
    // 生成 .json 文件
    webpackConfig.module.rule('vue custom block')
        .resourceQuery(/blockType=config/)
        .use('file-loader').loader('file-loader')
        .options({
            name: file => getNameByFilePath(file) + '.json',
        })

    // 将 .yaml 文件转成 .json
    // <config lang="yaml">
    webpackConfig.module.rule('yaml')
        .test(/\.ya?ml$/)
        .use('yaml-loader').loader('yaml-loader')

    // 处理 <template lang="wxml">{...}</template>
    // 生成 .wxml 文件
    webpackConfig.module.rule('vue template')
        .test(/\.wxml$/)
        .use('file-loader').loader('file-loader')
        .options({
            name: file => getNameByFilePath(file) + '.wxml',
        })
}

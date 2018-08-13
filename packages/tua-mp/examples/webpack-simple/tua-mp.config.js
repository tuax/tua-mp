module.exports = {
    enableEslint: true,
    chainWebpack: (config) => {
        // app 应用入口
        config.entry('app')
            // 因为默认入口是 ./src/app/index.js
            .clear()
            .add('./src/app/app').end()
    },
}

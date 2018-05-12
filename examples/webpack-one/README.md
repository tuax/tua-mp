# tua-mp-example-webpack-one
在这个例子中我们将源码放在了 `src/` 下，利用 `webpack` 将其打包生成到 `dist/` 目录下。

* 开发时运行 `npm start`，`webpack` 就会开启监听
* 发布时运行 `npm run build`，`webpack` 会先删除 `dist/` 然后将源码压缩生成到其中

此外还配置了 `babel` 和 `eslint`，具体使用时可以根据喜好自行更改配置。

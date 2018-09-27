# 一个基于 webpack4 自用的 H5 脚手架

## entry 的几种写法：

> 注意： 路径必须带上./

- 字符串的形式：单进单出 `entry:'./src/index.js'`
- 数组的形式：支持多进单出 `entry: ['./src/a.js','./src/b.js']`
- 对象的形式：支持多进多出 `entry:{a:'./src/a.js',b:'./src/b.js'}`

## output 输出部分

```js
output: {
    path: path.resolve(__dirname, '../dist/'), // 资源文件输出时写入的路径
    filename: 'static/js/[name].[chunkhash].js', // 使用 chunkhash 加入文件名做文件更新和缓存处理
    chunkFilename: 'static/js/[name].[chunkhash].js'
}
```

## 文件名 hash

hash 是用在文件输出的名字中的，如 [name].[hash].js，总的来说，webpack 提供了三种 hash：

- [hash]：此次打包的所有内容的 hash。
- [chunkhash]：每一个 chunk 都根据自身的内容计算而来。
- [contenthash]：由 css 提取插件提供，根据自身内容计算得来。

## loader 优先级

- 同 test 配置内优先级：在同一个 test 下配置多个 loader ，优先处理的 loader 放在配置数组的后面;
- 不同 test 内优先级：如对 js 文件的处理需要两个 test 分别配置，使用 eslint-loader 和 babel-loader ，但是又不能配置在一个配置对象内，可使用 enforce: 'pre' 强调优先级。

## 设置环境变量

设置 process.env.NODE_ENV 的值设为 production 其实是使用 DefinePlugin 插件：

```js
new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify("production")
});
```

从而我们可以在业务代码中通过 process.env.NODE_ENV，如进行判断，使用开发接口还是线上接口。如果我们需要在 webpack 中判断当前环境，还需要单独的设置 `process.env.NODE_ENV = 'production'`

## 拆分 js 代码

使用过 webpack 我们一般会提取出这么几个文件 manifest.js（webpack 运行时，即 webpack 解析其他 bundle 的代码等）、vendor.js（node_modules 内的库）、app.js（真正的项目业务代码）。在 webpack3 中我们使用 webpack.optimize.CommonsChunkPlugin 插件进行提取，webpack4 中我们可以直接使用 optimization 配置项进行配置（当然仍可使用插件配置）：

```js
    /**
     * 优化部分包括代码拆分
     * 且运行时（manifest）的代码拆分提取为了独立的 runtimeChunk 配置 
     */
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                // 提取 node_modules 中代码
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                },
                commons: {
                    // async 设置提取异步代码中的公用代码
                    chunks: "async",
                    name: 'commons-async',
                    /**
                     * minSize 默认为 30000
                     * 想要使代码拆分真的按照我们的设置来
                     * 需要减小 minSize
                     */
                    minSize: 0,
                    // 至少为两个 chunks 的公用代码
                    minChunks: 2
                }
            }
        },
        /**
         * 对应原来的 minchunks: Infinity
         * 提取 webpack 运行时代码
         * 直接置为 true 或设置 name
         */
        runtimeChunk: {
            name: 'manifest'
        }
    }
```

也可将不会变的开发依赖配置到单独的entry中，如：

```js
entry: {
    app: 'index.js',
    vendor2: ['vue', 'vue-router', 'axios']
}
```

## 解析 html 中的 img 标签

[html-url-loader](http://npm.taobao.org/package/html-url-loader)

```js
exports.html = () => {
    return {
        test: /\.html?$/,
        loader: 'html-url-loader',
        query: { deep: true }
    }
}
```

## 开发服务配置 devServer

```js
devServer: {
    clientLogLevel: 'warning',
    inline: true,
    // 启动热更新
    hot: true,
    // 在页面上全屏输出报错信息
    overlay: {
        warnings: true,
        errors: true
    },
    // 显示 webpack 构建进度
    progress: true,
    // dev-server 服务路径
    contentBase: false,
    compress: true,
    host: 'localhost',
    port: '8080',
    // 自动打开浏览器
    open: true,
    // 可以进行接口代理配置
    proxy： xxx,
    // 跟 friendly-errors-webpack-plugin 插件配合
    quiet: true,
    publicPath: '/'
}
```

### 其他插件

devServer 使用热更新 hot 时需要使用插件：

```js
plugins: [
    new webpack.HotModuleReplacementPlugin()
]
```

优化 webpack 输出信息，需要配置：

```js
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
plugins: [
    new FriendlyErrorsPlugin()
]
```

### 注意事项

- 热更新：在使用热更新时，我们的 chunk 名中不能使用 [hash] 做标识，文件名变化无法热更新，所以需要将原来配置在公共配置中的 output 中的文件名配置分别写入生产和开发模式配置中，开发模式去掉 [hash]

```js
filename: 'static/[name].js', 
chunkFilename: 'static/[id].js'
```

- HtmlWebpackPlugin：在生产模式下，我们将 html 文件写入到 dist 下，但是在开发模式下，并没有实际的写入过程，且 devServer 启动后的服务内容与 contentBase 有关，两者需要一致，所以我们将 HtmlWebpackPlugin 的配置也分为 生产和开发模式，开发模式下使用：

```js
new HtmlWebpackPlugin({
  filename: 'index.html', // 文件写入路径，前面的路径与 devServer 中 contentBase 对应
  template: path.resolve(__dirname, '../src/index.html'),// 模板文件路径
  inject: true
})
```

## 雪碧图生成

现解决方案使用 [PostCSS](https://github.com/postcss/postcss) plugin [postcss-sprites](https://github.com/2createStudio/postcss-sprites#readme)后处理方案，[关于雪碧图预处理和后处理方案的讨论](https://juejin.im/entry/59ca15575188256abd12ebf2) 可参考这篇！

安装：`yarn add postcss-sprites -D`

```js
sprites({
    spritePath: './src/static/images',
    spritesmith: {
        engine: 'pixelsmith',
        algorithm: 'binary-tree',
        padding: 30
    },
    filterBy(image) {
        // 忽略文件路径中含有 `skip`, `jpg` 的图片
        // 下面规则表示 `.jpg` 格式的图片和文件名中含有 `skip` 的图片将不会被合并到雪碧图中
        if (
            /\.(svg|gif|jpg)$/.test(image.url) ||
            /skip/.test(image.url)
        )
            return Promise.reject();
        return Promise.resolve();
    },
})
```

isprite-loader 貌似有点问题 待考究）

`yarn add isprite-loader -D`

```js
const spriteLoader = {
  loader: "isprite-loader",
  options: {
    outputPath: "./src/static/images/",
    mobile: true
  }
};
```

参考：[webpack 雪碧图生成](https://juejin.im/post/5aef09b26fb9a07ac23aa4a6) 附 [demo](https://github.com/Klchan-me/srpite)

### 移动端适配方案

参考使用 [Night](https://github.com/sunmaobin) 移动端页面适配解决方案，另外 Night 的[移动端 H5 解惑-页面适配](https://github.com/sunmaobin/sunmaobin.github.io/issues/28) 也是很值得一看的。

这个也不错 [移动端全屏滑动h5活动解决方案](https://github.com/chesscai/flexible-adaptive)

## 一些参考：

[webpack官网](https://webpack.docschina.org/concepts/)

[Webpack 配置详解（含 4）——关注细节](https://segmentfault.com/a/1190000014685887#articleHeader4)

[脚手架 | 用html-cli为你减少30%的H5工作量](https://zhuanlan.zhihu.com/p/36029902)

[从实践中寻找webpack4最优配置](https://juejin.im/post/5b07d02a6fb9a07aa213c9bc)

[webpack4.x-learn](https://github.com/wlx200510/webpack4.x-learn)

[vue-webpack4-learning](https://github.com/toBeTheLight/vue-webpack4-learning)

[Webpack 备忘录](https://xiaogliu.github.io/2018/07/09/webpack-memo/)

[Webpack 4 使用指南](https://juejin.im/post/5ad1ef5d518825556534f137)

[基于 webpack 的持久化缓存方案](https://github.com/pigcan/blog/issues/9)

[理解 Webpack3 路径配置项](https://www.qinshenxue.com/article/20170315092242.html)

[如何在 webpack 中引入未模块化的库，如 Zepto](https://sebastianblade.com/how-to-import-unmodular-library-like-zepto/)

[利用PostCSS解决移动端REM适配问题](https://segmentfault.com/a/1190000010947054)
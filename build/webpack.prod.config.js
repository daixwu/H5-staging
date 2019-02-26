const path = require('path');
const plugin = require('./plugin');
const { resolve } = require('./utils');
const baseConfig = require('./webpack.base');
const merge = require('webpack-merge'); //优化配置代码的工具

const prodWebpackConfig = {
    output:{
        path: path.resolve('dist'),
        publicPath: './',
        filename: 'static/[name].[chunkhash:7].js',
        chunkFilename: 'static/[name].[chunkhash:7].js'
    },
    plugins: [
        plugin.html('index'),
        plugin.clean(),
        plugin.optimizeCSS(),
        plugin.PurifyCSS(),
        plugin.PUglify(),
    ],
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
    },
}


module.exports = merge(
    baseConfig,
    prodWebpackConfig
);
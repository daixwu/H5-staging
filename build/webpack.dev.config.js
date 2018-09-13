const path = require('path');
const {resolve} = require('./utils');
const plugin = require('./plugin');
const internalIp = require('internal-ip');
const baseConfig = require('./webpack.base');
const merge = require('webpack-merge'); // 优化配置代码的工具
const localIP = internalIp.v4.sync();

const devWebpackConfig = {
    output:{
        publicPath: '/',
        filename: 'static/[name].js',
        chunkFilename: 'static/[name].js'
    },
    devtool: 'eval-source-map', // 指定加source-map的方式
    devServer: {
        clientLogLevel: 'warning',
        inline:true, // 打包后加入一个websocket客户端
        hot:true, // 启动热更新
        contentBase: false,  // dev-server 服务路径录
        port: 8080, // 端口
        host: localIP,
        // 在页面上全屏输出报错信息
        overlay: {
            warnings: true,
            errors: true
        },
        // 显示 webpack 构建进度
        progress: true,
        compress: false, // 服务器返回浏览器的时候是否启动gzip压缩
        // 自动打开浏览器
        open: true,
        // 跟 friendly-errors-webpack-plugin 插件配合
        quiet: true,
        publicPath: '/'
    },
    watchOptions: {
        ignored: /node_modules/, //忽略不用监听变更的目录
        aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
        poll:1000 //每秒询问的文件变更的次数
    },
    plugins: [
        plugin.hmr(), // 热更新
        plugin.nm(), // 热更新
        plugin.friendlyErrors(),
        plugin.html('index')
    ]
}

module.exports = merge(
    baseConfig,
    devWebpackConfig
);
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');

const internalIp = require('internal-ip');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const happyPack = require('happypack')
const os = require('os')
const happyThreadPool = happyPack.ThreadPool({ size: os.cpus().length })

const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制静态资源的插件
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清空打包目录的插件


const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const vConsolePlugin = require('vconsole-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const dev = process.env.NODE_ENV === 'development';

// 用于多进程打包 js
exports.happyPack = () => {
    return new happyPack({
        // 用id来标识 happyPack 处理那类文件
        id: 'happy-babel-js',
        //如何处理  用法和 loader 的配置一样
        loaders: ['babel-loader?cacheDirectory=true'],
        //共享进程池
        threadPool: happyThreadPool
    })
}

// 分离css文件
exports.extractCSS = (opt = {}) => {
    return new MiniCssExtractPlugin({
        filename: dev ? 'static/[name].css' : 'static/[name].[contenthash:8].css',
        chunkFilename: dev ? 'static/[name].css' : 'static/[name].[contenthash:8].css'
    });
}

// 用于显示打包时间和进程
exports.ProgressBarPlugin = () => {
    return new ProgressBarPlugin({
        format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
    })
}

// 生成html
exports.html = (name) => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '..', 'src', name +'.html'), // 模板文件路径
        filename: dev ? name + '.html' : path.resolve(__dirname, '..', 'dist', name +'.html'),
        chunks:dev ? [name] : [name, 'runtime', 'vendors', 'commons'],
        hash: dev,// 防止缓存
        minify:{
            removeAttributeQuotes: dev ? false : true // 压缩 去掉引号
        }
    });
}

exports.dll = () => {
    return new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '..', 'dist', 'manifest.json')
    })
}

// 启用HMR
exports.hmr = () => {
    return new webpack.HotModuleReplacementPlugin();
}

// 启用HMR
exports.nm = () => {
    return new webpack.NamedModulesPlugin();
}

// 复制静态资源
exports.copy = () => {
    return new CopyWebpackPlugin([
        {
            from: path.join(__dirname, '..', 'src/assets/images/sprite'),
            to: path.join(__dirname,  '..', 'dist', 'images'),
            ignore: ['.*']
        }
    ])
}

// 清空打包目录
exports.clean = () => {
    return new CleanWebpackPlugin(['dist'], {
        root: path.join(__dirname, '..'),
        exclude: ['manifest.json', 'vendor.dll.js'],
        verbose: true,
        dry:  false
    })
}

// 优化css打包，避免重复打包
exports.optimizeCSS = () => {
    return new OptimizeCSSPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g,
        cssProcessorOptions: {
            safe: true,
            autoprefixer: {
                disable: true
            },
            mergeLonghand: false,
            discardComments: {
                removeAll: true  // 移除注释
            }
        },
        canPrint: true
    });
}

// 用于 css 的 tree-shaking
exports.PurifyCSS = () => {
    return new PurifyCSSPlugin({
        paths: glob.sync(path.join(__dirname, '../src/*.html'))
    })
}

// 用于 js 的 tree-shaking
exports.PUglify = () => {
    return new WebpackParallelUglifyPlugin({
        uglifyJS: {
            output: {
                beautify: false, //不需要格式化
                comments: false //不保留注释
            },
            compress: {
                warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
            }
        }
    })
}

// 优化控制台输出
exports.friendlyErrors = () => {
    const localIP = internalIp.v4.sync();

    return new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: [`Your application is running here: ${localIP}:8080`],
        }
    });
}


// 移动端调试
exports.vConsolePlugin = () => {
    return new vConsolePlugin({
        filter: [],  // 需要过滤的入口文件
        enable: dev // 发布代码前记得改回 false
    })
}
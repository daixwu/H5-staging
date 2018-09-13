const path = require('path');
const {resolve, assetsPath} = require('./utils');
const loader = require('./loader');
const plugin = require('./plugin');

module.exports = {
    /**
     * 1. __dirname 为node全局对象，是当前文件所在目录
     * 2. context为 查找entry和部分插件的前置路径
     */
    context: path.resolve(__dirname, '../'),
    entry: {
        index: './src/static/js/index.js'
    },
    resolve: {
        extensions: [".js",".css",".json"],
        alias: {} //配置别名可以加快webpack查找模块的速度
    },
    module: {
    // 多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的
    rules:[
        loader.css(),
        loader.happyBabel(),
        loader.images(),
        loader.medias(),
        loader.fonts()
    ]
    },
    plugins: [
        plugin.happyPack(),
        plugin.extractCSS(),
        plugin.vConsolePlugin()
    ]
}
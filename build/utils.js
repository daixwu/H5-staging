const fs = require('fs');
const path = require('path');

// path.join 方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径；
// path.resolve 方法会把一个路径或路径片段的序列解析为一个绝对路径。

exports.resolve = (dir) => {
    return path.join(__dirname, '..', dir)
}

exports.assetsPath = (_path_) => {
    let assetsSubDirectory;
    if (process.env.NODE_ENV === 'production') {
      assetsSubDirectory = 'static' //可根据实际情况修改
    } else {
      assetsSubDirectory = 'static'
    }
    return path.posix.join(assetsSubDirectory, _path_)
}

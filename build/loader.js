const fs = require('fs');
const {resolve, assetsPath} = require('./utils');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dev = process.env.NODE_ENV === 'development';

// 注：多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的

// css
const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: dev
    }
};
  

// postcss
const postCSSLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: dev
    }
};
  

// CSS文件单独提取出来
const MiniCssExtract = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        // 复写 css 文件中资源路径
        // 因为 css 文件中的外链是相对与 css 的，
        // 我们抽离的 css 文件在可能会单独放在 css 文件夹内
        // 引用其他如 img/a.png 会寻址错误
        // 这种情况下所以单独需要配置 publicPath，复写其中资源的路径
        publicPath: '../' 
    }
};

exports.css = () => {
    return {
        test: /\.(scss|css)$/,
        include: [resolve('src')], //限制范围，提高打包速度
        use: ['css-hot-loader', MiniCssExtract, cssLoader, postCSSLoader, 'sass-loader'],
        exclude: /node_modules/
    };
}

// babel
exports.happyBabel = () => {
    return {
        test: /\.jsx?$/,
        // 把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: 'happypack/loader?id=happy-babel-js',
        include: [resolve('src')],
        exclude: /node_modules/,
    };
}

// images
exports.images = () => {
    return {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: [{
                loader: 'url-loader',
                options: {
                    name: assetsPath('images/[name].[hash:7].[ext]'), // 图片输出的路径
                    limit: 1 * 1024,
                }
            },
        ]
    };
}

// fonts
exports.fonts = () => {
    return {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 3000,
            name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
    };
}

// media
exports.medias = (opt = {}) => {
    return {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 3000,
            name: assetsPath('media/[name].[hash:7].[ext]')
        }
    };
}
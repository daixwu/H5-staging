const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const sprites = require('postcss-sprites');
module.exports = {
    plugins: [
        autoprefixer(),
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
        }),
        pxtorem({
            rootValue: 200,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 6
        }),
        

    ]
}
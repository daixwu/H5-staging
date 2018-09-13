const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
    plugins: [
        autoprefixer(),
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
module.exports = {
    plugins: [
        require('autoprefixer'),
        require('stylelint'),
        require('precss'),
        require('postcss-preset-env'),
        require('postcss-import'),
        require('postcss-nested'),
        require('cssnano')
    ]
}
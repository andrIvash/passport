
var webpack = require("webpack");

module.exports = {
    entry: './src/scripts/main.js',
    output: {
        path: './app/js',
        filename: 'app.bundle.js',
        sourceMapFilename: 'app.map'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
};
const readFileSync = require( "fs" ).readFileSync;
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

module.exports = {
    entry: {
        index: "./src/index.js"
    },
    output: {
        filename: "./lib/[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel",
                options: Object.assign( JSON.parse( readFileSync( ".babelrc" ) ), {
                    presets: [ "@babel/preset-env" ]
                })
            },
            {
                test: /\.s?css$/,
                loader: MiniCssExtractPlugin.loader
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "lib/calendar.css",
            chunkFilename: "[id].css"
        })
    ]
};
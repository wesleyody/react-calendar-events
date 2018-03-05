const readFileSync = require( "fs" ).readFileSync;
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );

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
                query: Object.assign( JSON.parse( readFileSync( ".babelrc" ) ), {
                    presets: [ "es2015" ]
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract( "css!sass" )
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin( "lib/calendar.css", {
            allChunks: true
        })
    ]
};
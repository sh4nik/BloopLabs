const path = require('path');
const config = {
    entry: [path.resolve(__dirname, 'index.js')],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'blooplabs-engine.js'
    },
    node: { fs: 'empty' },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    devServer: {
        port: 3000,
        contentBase: __dirname + '/build',
        inline: true
    },
    stats: {
        colors: true
    }
};

module.exports = config;

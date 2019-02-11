const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [new CleanWebpackPlugin(['dist/*.js'])],
  output: {
    filename: 'BloopLabs.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'BloopLabs',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          fix: true
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};

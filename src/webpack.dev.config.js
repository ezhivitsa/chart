const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: {
    main: [
      '@babel/polyfill',
      './scripts/index.js',
    ],
  },

  output: {
    path: `${__dirname}/static/`,
    publicPath: '/static/',
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
  },

  context: __dirname,

  node: {
    fs: 'empty',
    net: 'empty',
    constants: false,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.pcss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },

  devtool: 'eval',

  resolve: {
    modules: ['./scripts', 'node_modules'],
    extensions: ['.js'],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './views/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};

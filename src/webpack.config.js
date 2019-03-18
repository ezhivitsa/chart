const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const incstr = require('incstr');

const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789',
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = nextId;

    return index[name];
  };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const getComponentName = (resourcePath, separator) => {
  return resourcePath.split(separator).slice(-5, -1).join(separator);
};

const generateScopedName = (localName, resourcePath) => {
  const componentUnixName = getComponentName(resourcePath, '/');
  const componentWindowsName = getComponentName(resourcePath, '\\');

  const componentName = componentUnixName > componentWindowsName
    ? componentUnixName
    : componentWindowsName;

  return `${uniqueIdGenerator(componentName)}_${uniqueIdGenerator(localName)}`;
};

module.exports = {
  mode: 'production',

  entry: {
    main: [
      '@babel/polyfill',
      './scripts/index.js',
    ],
  },

  output: {
    path: `${__dirname}/static/`,
    publicPath: '/',
    filename: 'main.[hash].js',
  },

  context: path.resolve(__dirname, './'),

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
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'react-css-modules',
              {
                generateScopedName,
                webpackHotModuleReloading: false,
              },
            ],
          ],
        },
      },
      {
        test: /\.pcss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              camelCase: true,
              getLocalIdent: ({ resourcePath }, localIdentName, localName) => {
                return generateScopedName(localName, resourcePath);
              },
              modules: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },

  devtool: 'source-map',

  resolve: {
    modules: ['./scripts', 'node_modules'],
    extensions: ['.mjs', '.js'],
  },

  optimization: {
    minimize: true,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.[hash].css',
      chunkFilename: 'main.[id].[hash].css',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BABEL_ENV: JSON.stringify('production'),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'views/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};

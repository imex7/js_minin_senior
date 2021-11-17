const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const hwp = require('html-webpack-plugin')
const cwp = require('copy-webpack-plugin')
const mcep = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
console.log('Production = ', isProd);

const filename = (ext) => {
  return isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`
}

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    bundle: './index.js',
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '*': path.resolve(__dirname, 'src'),
      '*core': path.resolve(__dirname, 'src/core')
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 20000,
    hot: isDev
  },
  plugins: [
    new CleanWebpackPlugin(),
    new hwp({
      template: 'index.html',
      filename: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      }
    }),
    new cwp({
      patterns: [
        {from: 'favicon.ico', to: ''}
      ],
    }),
    new mcep({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: mcep.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            }
          },
          'css-loader', 'sass-loader'],
      },
    ],
  },
}

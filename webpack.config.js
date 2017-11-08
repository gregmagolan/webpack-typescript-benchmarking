'use strict';

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

function root(sub) {
  return path.join(path.resolve(), sub);
}

module.exports = {
  context: __dirname, // to automatically find tsconfig.json
  target: 'web',
  // For useful debugging, make sure source maps point to original TS content
  devtool: 'cheap-module-eval-source-map',
  entry: './src/main.js',
  output: { path: root('dist'), pathinfo: true, filename: 'index.js' },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        { from: 'index.html', to: root('dist') },
      ]),
  ]
};

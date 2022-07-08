const { override, addBabelPlugin, addWebpackPlugin } = require('customize-cra');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = override(
  addBabelPlugin(['@babel/plugin-transform-exponentiation-operator', { loose: false }]),
  addBabelPlugin(['@babel/plugin-syntax-bigint', { loose: false }]),
  // addWebpackPlugin(new CopyPlugin({ patterns: [{ from: './404.html' }] })),
  // addWebpackResolve({ plugins: new TsconfigPathsPlugin() })
);

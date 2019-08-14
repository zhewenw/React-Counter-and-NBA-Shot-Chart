// for babel-plugin-webpack-loaders
require('babel-register');
const devConfigs = require('./webpack.config.development');

module.exports = {
  width: 900,
  height: 600,
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: devConfigs.module.loaders.slice(1)  // remove babel-loader
  }
};

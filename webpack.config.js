'use strict';

var webpack = require('webpack');
var env = process.env.NODE_ENV;

var config = {
  externals: {
    'reselect': {
      root: 'Reselect',
      commonjs2: 'reselect',
      commonjs: 'reselect',
      amd: 'reselect'
    },
    'normalizr': {
      root: 'Normalizr',
      commonjs2: 'normalizr',
      commonjs: 'normalizr',
      amd: 'normalizr'
    },
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'ReduxState',
    libraryTarget: 'umd'
  },
  plugins: [
    {
      apply: function apply(compiler) {
        compiler.parser.plugin('expression global', function expressionGlobalPlugin() {
          this.state.module.addVariable('global', "(function() { return this; }()) || Function('return this')()")
          return false
        })
      }
    },
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
};

module.exports = config;
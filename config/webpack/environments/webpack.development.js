const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const path = require('path');
const { applyPresets } = require('..');
const paths = require('../../paths');
const DEFAULT_STATIC_CONTENTS = require('../presets/webpack.serveStatics')
  .DEFAULT_STATIC_CONTENTS;

module.exports = env =>
  webpackMerge(
    {
      output: {
        filename: 'static/js/[name].[hash:8].bundle.js',
        chunkFilename: 'static/js/[name].[hash:8].chunk.js',
        devtoolModuleFilenameTemplate: info =>
          path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
      },
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        },
      },
      devtool: 'cheap-module-eval-source-map',
      devServer: {
        historyApiFallback: true,
        contentBase: DEFAULT_STATIC_CONTENTS,
      },
      plugins: [
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebook/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebook/create-react-app/issues/186
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        new webpack.NamedModulesPlugin(),
      ],
    },
    applyPresets({ ...env, presets: ['loadCss'] }),
  );

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const path = require('path');
const { applyPresets } = require('..');
const paths = require('../../paths');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

module.exports = env =>
  webpackMerge(
    {
      output: {
        filename: 'static/js/[name].[contentHash:8].bundle.js',
        chunkFilename: 'static/js/[name].[contentHash:8].chunk.js',
        devtoolModuleFilenameTemplate: info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/'),
      },
      bail: true,
      // * Do not use together with webpack.SourceMapDevToolPlugin
      devtool: shouldUseSourceMap && 'source-map',
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              parse: {
                // we want terser to parse ecma 8 code. However, we don't want it
                // to apply any minification steps that turns valid ecma 5 code
                // into invalid ecma 5 code. This is why the 'compress' and 'output'
                // sections only apply transformations that are ecma 5 safe
                // https://github.com/facebook/create-react-app/pull/4234
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebook/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
                // Disabled because of an issue with Terser breaking valid code:
                // https://github.com/facebook/create-react-app/issues/5250
                // Pending further investigation:
                // https://github.com/terser-js/terser/issues/120
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebook/create-react-app/issues/2488
                ascii_only: true,
              },
            },
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            // Enable file caching
            cache: true,
            sourceMap: shouldUseSourceMap,
          }),
          // This is only used in production mode
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              map: shouldUseSourceMap
                ? {
                    // `inline: false` forces the sourcemap to be output into a
                    // separate file
                    inline: false,
                    // `annotation: true` appends the sourceMappingURL to the end of
                    // the css file, helping the browser find the sourcemap
                    annotation: true,
                  }
                : false,
            },
          }),
        ],
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        // splitChunks: {
        //   chunks: 'all',
        //   name: false,
        // },
        // Keep the runtime chunk separated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        // runtimeChunk: true,
      },
      plugins: [
        new webpack.HashedModuleIdsPlugin(),
        // Inlines the webpack runtime script. This script is too small to warrant
        // a network request.
        shouldInlineRuntimeChunk &&
          new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
        // * Do not use together with devtool
        // shouldUseSourceMap &&
        //   new webpack.SourceMapDevToolPlugin({
        //     exclude: /vendors/,
        //     filename: '[file].map[query]',
        //   }),
      ],
    },
    applyPresets({ ...env, presets: ['extractCss', 'splitVendors'] }),
  );

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactLoadablePlugin = require('react-loadable/webpack')
  .ReactLoadablePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { applyPresets } = require('..');
const getClientEnvironment = require('../../env');
const paths = require('../../paths');

const DEFAULT_OUTPUT_PATH = paths.appBuild;

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000',
);

module.exports = ({
  mode = 'production',
  output: { path: outputPath = DEFAULT_OUTPUT_PATH, ...restOutput } = {},
  ...restEnv
} = {}) => {
  const isEnvDevelopment = mode === 'development';
  const isEnvProduction = mode === 'production';

  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // In development, we always serve from the root. This makes config easier.
  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && '/';

  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && '';

  // Get environment variables to inject into our app.
  const env = getClientEnvironment(publicUrl);

  return webpackMerge(
    {
      mode,
      output: {
        path: outputPath,
        publicPath,
        // TODO: remove this when upgrading to webpack 5
        futureEmitAssets: true,
      },
      module: {
        strictExportPresence: true,
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: isEnvProduction,
              compact: isEnvProduction,
            },
          },
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: /\.(bmp|png|jpe?g|gif|svg)$/,
            loader: require.resolve('url-loader'),
            options: {
              limit: imageInlineSizeLimit,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      plugins: [
        // * This plugin must go first lest it removes generated content
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              inject: true,
              template: paths.appHtml,
            },
            isEnvProduction
              ? {
                  minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                  },
                }
              : undefined,
          ),
        ),
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In production, it will be an empty string unless you specify "homepage"
        // in `package.json`, in which case it will be the pathname of that URL.
        // In development, this will be an empty string.
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
        // It is absolutely essential that NODE_ENV is set to production
        // during a production build.
        // Otherwise React will be compiled in the very slow development mode.
        new webpack.DefinePlugin(env.stringified),
        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new ManifestPlugin({
          fileName: 'asset-manifest.json',
          publicPath,
          generate: (seed, files) => {
            const manifestFiles = files.reduce(function(manifest, file) {
              manifest[file.name] = file.path;
              return manifest;
            }, seed);

            return {
              files: manifestFiles,
            };
          },
        }),
        new ReactLoadablePlugin({
          filename: `${outputPath}/react-loadable.json`,
        }),
      ],
      // Some libraries import Node modules but don't use them in the browser.
      // Tell Webpack to provide empty mocks for them so importing them works.
      node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      },
    },
    applyPresets({
      ...restEnv,
      mode,
      output: { ...restOutput, path: outputPath },
      presets: ['serveStatics', 'showProgress'],
    }),
  );
};

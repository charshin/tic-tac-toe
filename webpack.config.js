const webpackMerge = require('webpack-merge');
const paths = require('./config/paths');
const { loadEnvironment, applyPresets } = require('./config/webpack');

const DEFAULT_ENV = {
  mode: 'production',
  output: { path: paths.appBuild },
};

module.exports = ({ presets = [], ...env } = DEFAULT_ENV) => {
  const finalEnv = webpackMerge(DEFAULT_ENV, env, {
    presets: [].concat(...[presets]),
  });

  const finalConfig = webpackMerge(
    {},
    loadEnvironment(finalEnv),
    applyPresets(finalEnv),
    /* App-specific webpack config */
    {
      entry: './client',
      resolve: {
        alias: {
          $app: paths.appSrc,
          $modules: `${paths.appSrc}/modules`,
          $api: `${paths.appSrc}/api`,
          $data: `${paths.appSrc}/data`,
          $components: `${paths.appSrc}/modules/common/components`,
          $controls: `${paths.appSrc}/modules/common/controls`,
          $utils: `${paths.appSrc}/modules/common/utils`,
        },
      },
      devServer: {
        host: '0.0.0.0',
        port: process.env.PORT || 5000,
      },
    },
  );

  if (process.env.CI) {
    finalConfig.optimization.minimize = false;
  }

  return finalConfig;
};

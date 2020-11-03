/* Set Default */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PLATFORM = process.env.PLATFORM || 'browser';

/* Flags */
const dev = process.env.NODE_ENV === 'development';
const test = process.env.NODE_ENV === 'test';
const prod = process.env.NODE_ENV === 'production';
const node = process.env.PLATFORM === 'node';

module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          // * Platform:
          // *  - browser: keep ES Modules Syntax for webpack treeshaking
          // *  - node: transpile to CommonJS for SSR
          modules: node ? 'cjs' : false,
          targets: node
            ? { node: 'current' }
            : ['> 1%', 'last 2 versions', 'not ie <= 8'],
          useBuiltIns: 'usage',
          corejs: { version: 3, proposals: true },
        },
      ],
      '@babel/preset-react',
      '@emotion/babel-preset-css-prop',
    ],
    plugins: [
      // Stage 0
      // '@babel/plugin-proposal-function-bind',

      // Stage 1
      // '@babel/plugin-proposal-export-default-from',
      // '@babel/plugin-proposal-logical-assignment-operators',
      ['@babel/plugin-proposal-optional-chaining', { loose: false }],
      // ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
      ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
      '@babel/plugin-proposal-do-expressions',

      // Stage 2
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      // '@babel/plugin-proposal-function-sent',
      // '@babel/plugin-proposal-export-namespace-from',
      // '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',

      // Stage 3
      // '@babel/plugin-syntax-import-meta',
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      // '@babel/plugin-proposal-json-strings',

      '@babel/plugin-transform-runtime',
      'react-require',
      'react-loadable/babel',

      /* @babel/plugin-syntax-dynamic-import
        babel needs this for parsing but won't touch the syntax,
        webpack will handle the syntax.
      */
      node ? 'dynamic-import-node' : '@babel/plugin-syntax-dynamic-import',
      (dev || test) && '@babel/plugin-transform-react-jsx-source',
      (prod || node) && 'transform-react-remove-prop-types',
    ].filter(Boolean),
  };
};

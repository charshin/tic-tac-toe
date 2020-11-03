module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            // importLoaders: 1 since there must be 1 loader applied before it, i.e. postcss-loader
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1, modules: true },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /\.module\.(scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 2 },
          },
          'postcss-loader',
          'sass-loader',
        ],
        sideEffects: true,
      },
      {
        test: /\.module\.(scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 2, modules: true },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
});

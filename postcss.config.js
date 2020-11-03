/* eslint-disable global-require */
const paths = require('./config/paths');

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production'
      ? [
          require('@fullhuman/postcss-purgecss')({
            content: [paths.appHtml, `${paths.appSrc}/**/*.js`],
            // Tailwind specific
            defaultExtractor: content => {
              // Capture as liberally as possible, including things like `h-(screen-1.5)`
              const broadMatches =
                content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              // Capture classes within other delimiters like .block(class="w-1/2") in Pug
              const innerMatches =
                content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

              return broadMatches.concat(innerMatches);
            },
            // Support dynamic class, i.e. add/remove class by aos, react-css-transition-replace, etc
            whitelistPatterns: [
              // react-css-transition-replace
              /cross-fade/,
              /fade-wait/,
              /carousel-swap/,
              /roll-up/,
              /fade-fast/,
            ],
          }),
        ]
      : []),
  ],
};

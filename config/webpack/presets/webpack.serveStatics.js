const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('../../paths');

const DEFAULT_STATIC_CONTENTS = [paths.appPublic];

const serveStatics = ({ staticContents = DEFAULT_STATIC_CONTENTS }) => ({
  plugins: [new CopyWebpackPlugin([].concat(...[staticContents]))],
});

serveStatics.DEFAULT_STATIC_CONTENTS = DEFAULT_STATIC_CONTENTS;

module.exports = serveStatics;

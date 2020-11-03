module.exports = ({ runtimeChunk = 'single' }) => ({
  optimization: {
    runtimeChunk,
  },
});

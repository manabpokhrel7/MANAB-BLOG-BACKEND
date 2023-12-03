const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to files ending in .js
        exclude: /node_modules/, // Don't apply to files residing in node_modules
        use: {
          loader: 'babel-loader', // Use the Babel loader
          options: {
            presets: ['@babel/preset-env'], // Use the @babel/preset-env preset
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('http-browserify'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      vm: require.resolve('vm-browserify'),
      buffer: require.resolve('buffer/'),
      constants: require.resolve('constants-browserify'),
      process: require.resolve('process/browser'),
      punycode: require.resolve('punycode/'),
      querystring: require.resolve('querystring-es3/'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
    },
  },
  
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
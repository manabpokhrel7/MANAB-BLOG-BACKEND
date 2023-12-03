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
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      dns: require.resolve('dns'),
      url: require.resolve('url'),
      timers: require.resolve('timers-browserify'),
      http: require.resolve('http-browserify'), // Revert back to http-browserify
      os: require.resolve('os-browserify/browser'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    },
  },
  // Other configurations go here
};

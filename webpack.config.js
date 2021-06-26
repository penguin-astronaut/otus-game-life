const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'es5',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  devServer: {
    compress: true,
    port: 9000,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },
};

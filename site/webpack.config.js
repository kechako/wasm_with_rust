const path = require('path');

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
      {
        test: /\.wasm$/,
        include: path.resolve(__dirname, 'src'),
        use: [{loader: require.resolve('wasm-loader'), options: {}}],
      }
    ]
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [
      ".js",
      ".ts",
      ".wasm"
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public')
  },
  mode: "development"
};

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getAbsolutePath = (target) => path.resolve(__dirname, target);
const isDevMode = process.env.NODE_ENV === "development";

const defaultPlugins = [
  new HtmlWebpackPlugin({
    template: "./src/client/index.html",
  }),
  new CleanWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

const defaultEntry = ["./src/client/javascript/index.js"];

if (!isDevMode) {
  defaultPlugins.push(
    new MiniCssExtractPlugin({
      linkType: false,
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    })
  );
}
if (isDevMode) {
  defaultEntry.push(
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000"
  );
}

module.exports = {
  mode: isDevMode ? "development" : "production",
  entry: defaultEntry,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: defaultPlugins,
  devtool: isDevMode ? "inline-source-map" : undefined,
  resolve: {
    extensions: [".js"],
    alias: {
      "@scss": getAbsolutePath("src/client/scss/"),
      "@js": getAbsolutePath("src/client/javascript/"),
    },
  },
};

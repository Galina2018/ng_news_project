const path = require("path");
//const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    app: "./js/app.js",
  },

  context: path.resolve(__dirname, "src"),
  devServer: {
    publicPath: "/",
    port: 9000,
    host: "localhost",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "./style.css" }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new CleanWebpackPlugin(),
  ],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js",
  },
  mode: "development",
};

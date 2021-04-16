const path = require("path");
// const webpack = require("webpack");
//const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    //    polyfill: "babel-polyfill",
    app: "./js/app.js",
  },

  context: path.resolve(__dirname, "src"),
  devServer: {
    publicPath: "/",
    port: 9000,
    //    contentBase: path.join(process.cwd(), 'dist'),
    host: "localhost",
    //   historyApiFallback: true,
    //   noInfo: false,
    //   stats: 'minimal',
    //   hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "./style.css" }),
    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        collapseWhitespace: false,
      },
    }),
    new CleanWebpackPlugin(),
  ],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js",
  },
  mode: "development",
};

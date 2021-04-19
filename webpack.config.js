const path = require("path");
// const webpack = require("webpack");
//const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
// const { config } = require("process");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
console.log("is dev: ", isDev);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    (config.minimize = true),
      (config.minimizer = [
        new OptimizeCssAssetWebpackPlugin(),
        new TerserWebpackPlugin(),
      ]);
  }
  return config;
};

module.exports = {
  entry: {
    //    polyfill: "babel-polyfill",
    app: "./js/app.js",
  },

  context: path.resolve(__dirname, "src"),
  optimization: optimization(),

  devServer: {
    publicPath: "/",
    port: 9000,
    hot: isDev,
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
    new MiniCssExtractPlugin({ filename: "[name].[hash].css" }),
    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        collapseWhitespace: isProd,
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

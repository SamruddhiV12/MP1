const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "",
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.s?css$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webp)$/i,
        type: "asset/resource",
        generator: { filename: "assets/[name][ext]" },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body",
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/assets"),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
      watch: true,
    },
    compress: true,
    port: 8082,
    hot: true,
    open: true,
  },

  devtool: "source-map",
};

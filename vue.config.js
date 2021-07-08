const webpack = require("webpack");
const env = process.env.NODE_ENV === "development" ? require("./env.dev") : require("./env.prod");

module.exports = {
  lintOnSave: false, // false 取消 eslint 验证
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  publicPath: "/", // 基本路径
  outputDir: "dist", // 输出文件目录
  assetsDir: "./assets", // 改成相对路径，默认为assets
  indexPath: "index.html",
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: env.VUE_APP_URL_STRING,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  pages: {
    index: {
      entry: "src/main.js", // 必须加
      title: "首页", // 首页标题，也可以在路由里动态设置
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": env,
      }),
    ],
  },
};

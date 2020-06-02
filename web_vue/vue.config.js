const webpack = require("webpack")
const FileManagerPlugin = require('filemanager-webpack-plugin')
const changeVersionPlugin = require('./webpackPlugins/changeVersionPlugin.js')

// 版本管理
let date = new Date()
let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
const time = String(date.getFullYear()) + String(month) + String(day)

const argv = JSON.parse(process.env.npm_config_argv)
const config = {}
// 获取自定义参数
let idx = 2
const cooked = argv.cooked
const length = argv.cooked.length
while ((idx += 2) <= length) {
  config[cooked[idx - 2]] = cooked[idx - 1]
}
// console.log(config, "config")
process.env.VUE_APP_VERSION = config['--appVersion']
// console.log("页面ID：" + process.env.VUE_APP_VERSION)

module.exports = {
  outputDir: './dist/http_' + process.env.VUE_APP_VERSION + time,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
      config.plugins.push(
        new FileManagerPlugin({
          onEnd: {
            mkdir: [
              './packageZip'
            ],
            copy: [{
              source: './dist/http_' + process.env.VUE_APP_VERSION + time,
              destination: './packageZip/http_' + process.env.VUE_APP_VERSION + time
            }],
            archive: [
              { source: './packageZip', destination: './dist/http_' + process.env.VUE_APP_VERSION + time + '.zip' },
            ],
            delete: [
              './packageZip'
            ]
          }
        })
      )
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        // 项目中使用 process.env.MY_VERSION 输出
        'process.env.MY_VERSION': JSON.stringify(require('./package.json').version)
      })
    )
    config.plugins.push(
      new webpack.ProvidePlugin({
        // 全局使用jQuery
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    )
    config.plugins.push(
      new changeVersionPlugin(
        {version: process.env.VUE_APP_VERSION}
      )
    )
  }
}
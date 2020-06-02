// 修改package.json中的版本号信息

const shell = require("shelljs") //同步执行cmd命令


module.exports = function writePackageJson(cbDataPackage, wholeVersion) {
  console.log(wholeVersion, 'wholeVersion')
  // 方法2：调用npm命令修改version值
  shell.exec("npm version " + wholeVersion)
  // console.log('----------------------修改package.json文件完毕，version修改为：', wholeVersion)
}

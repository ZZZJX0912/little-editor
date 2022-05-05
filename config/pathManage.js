//解决由于config文件位置导致的config文件内路径的配置问题
const path = require('path')

const appDir = process.cwd()

const resolvePath = (relativePath) => {
  return path.resolve(appDir,relativePath)
}


module.exports = resolvePath
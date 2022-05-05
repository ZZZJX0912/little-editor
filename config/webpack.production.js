const webpackBaseConfig = require('./webpack.base')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')


const webpackProdConfig = {
  //模式：开发模式，生产模式
  mode:'production',
  // 插件 更多功能 生命周期
  plugins:[
    //删除dist目录
    new CleanWebpackPlugin(),

    //无需打包，拷贝资源
    new CopyWebpackPlugin({
      patterns:[
        {
          from:'public',
          //默认 to: 上面output的路径
          globOptions:{
            //额外操作  **/ 指的是从from路径底下找
            ignore:['**/index.html']
          }
        }
      ]
    })
  ]
}

module.exports = merge(webpackBaseConfig,webpackProdConfig)
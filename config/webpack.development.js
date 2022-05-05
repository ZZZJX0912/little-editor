const webpackBaseConfig = require('./webpack.base')
const { DefinePlugin } = require('webpack')
//vue-loader 14无需该plugin
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { merge } = require('webpack-merge')

const webpackDevConfig = {
  //模式：开发模式，发布模式
  mode:'development',
  //source-map 映射，便于在调试阶段定位到源代码中的信息
  devtool:'cheap-module-source-map',
  target:'web',
  devServer:{
    static:{
      //指定本地服务所在的目录
      publicPath:'/',
    },
    hot:'only',
    //压缩(性能提升)
    compress:true,
    //解决前端路由刷新后的问题  如/about 对应404可跳转到index.html
    historyApiFallback:true,
    port:4400,
    //是否自动打开浏览器
    open:false
    
    // //静态资源（未被webpack进行打包处理）从哪进行查找
    // contentBase:path.resolve(__dirname,'public'),

    // //监控contentBase内的文件有无发生改变
    // watchContentBase:true,

    // proxy:{
    //   '/api':{
    //     //代理转发
    //     target:'https://api.github.com',
    //     pathRewrite:{'^/api':''},
    //     changeOrigin:true
    //   }
    // },
  },
  // 插件 更多功能 生命周期
  plugins:[
    //配置变量
    new DefinePlugin({
      BASE_URL:'"./"'
    }),
    new VueLoaderPlugin()
  ]
}
//合并配置
module.exports = merge(webpackBaseConfig,webpackDevConfig)
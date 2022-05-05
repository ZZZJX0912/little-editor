const resolvePath = require('./pathManage')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry:'./src/main.js',
  //webpack解析规则
  resolve:{
    //解析后缀名 
    extensions: ['.js', 'jsx', '.vue'],
    // 别名
    alias:{
      '@':resolvePath('./src')
    },
    mainFiles:['index']
  },
  output:{
    filename:'js/build.js',
    path:resolvePath('./dist'),
    // 域名 + publicPath + filename
    // 如果publicPath 为 ‘/’ 本地无法找到对应文件
    // 如果publicPath 为 ‘./’ 浏览器无法找到对应文件
    publicPath:'/'
  },


  //loader 转换 特定格式
  module:{
    rules:[
      //css
      {
        test:/\.css$/,
        use:[
          'style-loader',
          {
            loader:'css-loader',
            options:{
              importLoaders:1,
              esModule:false
            }
          },
          'postcss-loader',
        ]
      },


      //scss
      {
        test:/\.scss$/,
        use:[
          'style-loader',
          {
            loader:'css-loader',
            options:{
              importLoaders:2, //考虑到import的文件存在已经经过的loader所处理的代码，往回找loader，找两次
              esModule:false
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },


      //文件处理webpack4 写法
      // {
        // test:/\.(png|svg|gif|jpe?g)$/,
        // use:[
        //   {
        //     /**
        //      * url-loader转base64,减少请求次数
        //      * file-loader是静态文件按照规则拷贝到制定目录，分开请求
        //      * url-loader内部通过limit规则可以调用file-loader
        //      */
        //     loader:'url-loader',
        //     /**
        //      * [ext]：扩展名
        //      * [name]：文件名称
        //      * [hash:<length>]：文件内容生成的哈希，length为截取的哈希长度
        //      */
        //     options:{
        //       name:'img/[name].[hash:4].[ext]', 
        //       limit:24 * 1024, //24kb  超过对应大小调用file-loader拷贝静态文件，否则转成base64
        //       exModule:false // 不转成exModule，require文件时，无需.default取值
        //     }
        //   }
        // ]
      // },


      //webpack5 用asset模块统一处理
      //图片文件
      {
        test:/\.(png|svg|gif|jpe?g)$/,
        type:'asset',
        generator:{
          filename:'img/[name].[hash:4][ext]'
        },
        parser:{
          dataUrlCondition:{
            maxSize:24 * 1024
          }
        }
      },

      //字体，iconfont
      {
        test:/\.(ttf|woff2?)$/,
        type:'asset/resource',
        generator:{
          filename:'font/[name].[hash:3][ext]'
        }
      },

      //js 兼容处理
      {
        test:/\.js$/,
        exclude:/node_modules/,
        use:['babel-loader']
      },
      
      //vue
      {
        test:/\.vue$/,
        use:['vue-loader']
      }
    ]
  },
  // 插件 更多功能 生命周期
  plugins:[
    //生成index.html
    new HtmlWebpackPlugin({
      title:'little-editor',
      template:'./public/index.html'
    }),
  ]
}
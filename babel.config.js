module.exports = {
  presets:[
    [
      '@babel/preset-env',
      {
        // false: 不进行polyfill的填充
        // usage: 依据用户源代码当中所使用到的新语法进行填充（依据源代码按需填充）
        // entry: 依据浏览器的兼容进行填充（依据浏览器兼容情况进行填充）
        useBuiltIns:'usage',
        //定义corejs的大版本
        corejs: 3
      }
    ]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}

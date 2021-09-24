module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  }, 
  mini: {},
  h5: {},
  plugins: [
    [
        "@tarojs/plugin-mock",
        {   //Mock 插件可以接受如下参数
            host: "localhost",  //	设置数据 mock 服务地址，默认为 127.0.0.1
            port: 9527, //设置数据 mock 服务端口，默认为 9527
        },
    ],
]
}

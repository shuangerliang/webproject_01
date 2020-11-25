//1.开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
//2.测试环境服务器地址
// var baseURL=''
//拦截所有的ajax请求 处理参数
$.ajaxPrefilter(function (params) {
    //拼接服务器地址
    params.url=baseURL+params.url
})

$(function () {
    //用于获取信息
    getUserInfo()
})

var layer = layui.layer
$('#btnLogOut').on('click', function () {
    layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
        //1.清空本地缓存token
        localStorage.removeItem('token')
        //2.跳转到登录页面
        location.href = '/login.html'
        //3.关闭提示框
        layer.close(index)
    });

})
//其他页面要调用 全局函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //我们请求的时候就需要设置请求头信息，得到授权 把我们获取到的 `token` 传递给后台
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        }

    })
}

//
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    //2.用户头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        //首字母大写
        var text = name[0].toUpperCase()
        $('.text-avatar').show().html(text)

    }
}
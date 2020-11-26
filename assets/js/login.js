$(function () {
    //1.点击按钮 显示隐藏
    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link-login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //2.自定义校验规则
    var form = layui.form
    //密码规则 记得在lay-verify后面加
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //确认密码校验规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()//选择器带空格 后代【属性 值】
            if (pwd !== value) {
                return "两次输入密码不一致"
            }
        }
    })

    //监听注册表单的提交事件
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //提交成功后处理代码
                layer.msg('注册成功，请登录')
                //手动切换到登录表单
                $('#link-login').click()
                //重置表单
                $('#form_reg')[0].reset()
            }
        })
    })

    //登录表单 form标签绑定事件 button按钮触发提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),//快速获取表单数据
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }             

                //提示信息 保存token 未来接口要使用 跳转页面
                layer.msg('恭喜您登录成功')
                //权限校验 用户是否登录
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })

})
$(function () {
    var form = layui.form
    var layer = layui.layer
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverfile').click();
    })

    //监听coverfile的change事件 获取用户选择的文件列表
    $('#coverfile').on('change', function (e) {
        //拿到用户选择的文件
        var file = e.target.files[0]
        //createObjectURL的参数不能为undefined 
        if (file == undefined) {
            return
        }
        //根据选择文件创建地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var state = '已发布'
    $('#btnsave2').on('click', function () {
        state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //创建form对象 收集数据
        var fd = new FormData(this)
        //放入状态
        fd.append('state', state)
        //放入图片
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        })
            //将画布上的内容转化为文件对象
            .toBlob(function (blob) {

                fd.append('cover_img', blob)
                // console.log(...fd);
                publishArticle(fd)
            })

    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布成功过后 跳转到文章列表页面
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art-list').click()
                }, 1500);
            }
        })
    }
})
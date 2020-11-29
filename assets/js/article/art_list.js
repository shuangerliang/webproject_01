$(function () {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var layer = layui.layer
    var laypage = layui.laypage
    var form = layui.form
    //1.定义一个 提交参数
    var q = {
        pagenum: 1,//页码值
        pagesize: 10,//每页显示多少条数据
        cate_id: '',//文章分类的 Id
        state: '',//文章的状态，可选值有：已发布、草稿
    }

    initTable();
    initCase();
    //2.获取文章列表数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var str = template('tpl-table', res)
                $('tbody').html(str)
                renderPage(res.total)
            }

        })
    }

    //3.初始化文章分类
    function initCase() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    //4.筛选功能实现
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单选中项值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //渲染表单
        initTable()
    })


    //5.分页
    var laypage = layui.laypage
    function renderPage(total) {
        //调用 laypage.render 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//Id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示数据条数
            curr: q.pagenum,//设置默认被选中的分页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            jump: function (obj, first) {
                console.log(first, obj.curr, obj.limit);
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                if (!first) {
                    initTable()
                }
            }
        })
    }

    //代理删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        //获取删除按钮个数 判断
        // var len=$('.btn-delete').length
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功！')
                    //数据删除之后 要判断页面是否还有数据 
                    //如果没有数据 页码值减1 渲染数据 有的话 不减
                    // if (len === 1) {
                    //     q.pagenum=q.pagenum===1?1:q.pagenum-1
                    // }
                    if ($('.btn-delete').length == 1 && q.pagenum > 1)q.pagenum--;

                    initTable()
                }
            })
            layer.close(index)
        })
    })
})
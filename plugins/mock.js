import Mock from 'mockjs'

// 设置延迟时间
Mock.setup({
  timeout: '200-600'
})

// 文章列表数据
Mock.mock(/\/api\/articles/, 'get', {
  'code': 'success',
  'data': {
    'total': 100,
    'list|10': [{
      'id|+1': 1,
      'title': '@ctitle(10, 30)',
      'summary': '@cparagraph(1, 3)',
      'content': '@cparagraph(10, 20)',
      'cover': '@image("300x200", "#4A7BF7","#fff", "pic")',
      'date': '@date("yyyy-MM-dd")',
      'views|100-10000': 1000,
      'category|1': ['前端开发', '后端技术', '工具使用', '心得体会'],
      'tags|2-4': ['@ctitle(2,4)']
    }]
  }
})

// 分类文章
Mock.mock(/\/api\/articles\/category\/\d+/, 'get', {
  'code': 200,
  'data': {
    'total': 50,
    'categoryName': '@ctitle(4, 8)',
    'list|10': [{
      'id|+1': 1,
      'title': '@ctitle(10, 30)',
      'summary': '@cparagraph(1, 3)',
      'date': '@date("yyyy-MM-dd")',
      'views|100-10000': 1000,
      'tags|2-4': ['@ctitle(2,4)']
    }]
  }
})

// 文章详情
Mock.mock(/\/api\/articles\/detail\/(\d+)/, 'get', function(options) {
    return {
      'code': 'success',
      'message': 'success',
      'data': {
        'id': parseInt(options.url.match(/\/api\/articles\/detail\/(\d+)/)[1]),
        'title': '@ctitle(10, 30)',
        'content': '@cparagraph(20, 30)',
        'date': '@date("yyyy-MM-dd")',
        'views|100-10000': 1000,
        'category': '@ctitle(2,4)',
        'tags|2-4': ['@ctitle(2,4)'],
        'prev': {
          'id': parseInt(options.url.match(/\/api\/articles\/detail\/(\d+)/)[1]) - 1,
          'title': '@ctitle(10, 20)'
        },
        'next': {
          'id': parseInt(options.url.match(/\/api\/articles\/detail\/(\d+)/)[1]) + 1,
          'title': '@ctitle(10, 20)'
        }
      }
    }
})

// 发布文章
Mock.mock('/api/articles', 'post', {
  'code': 200,
  'message': '发布成功',
  'data': {
    'id|+1': 1
  }
})

// 文章详情 (已合并到/detail/:id接口，保留此注释以避免路由冲突)

// 上传图片
Mock.mock('/api/upload', 'post', {
  'code': 200,
  'data': {
    'url': '@image("300x200", "#4A7BF7","#fff", "pic")'
  }
})

// 更新文章
Mock.mock(/\/api\/articles\/\d+/, 'put', {
  'code': 200,
  'message': '更新成功',
  'data': null
})

// 删除文章
Mock.mock(/\/api\/articles\/\d+/, 'delete', {
  'code': 200,
  'message': '删除成功',
  'data': null
})

// 文章评论
Mock.mock(/\/api\/comments\/article\/\d+/, 'get', {
  'code': 200,
  'data': {
    'comments|5': [{
      'id|+1': 1,
      'author': '@cname()',
      'avatar': '@image("40x40", "#4A7BF7","#fff", "头像")',
      'content': '@cparagraph(1, 3)',
      'date': '@datetime("yyyy-MM-dd HH:mm")',
      'likes|0-50': 0,
      'replies|0-3': [{
        'id|+1': 100,
        'author': '@cname()',
        'avatar': '@image("30x30", "#4A7BF7","#fff", "头像")',
        'content': '@cparagraph(1)',
        'date': '@datetime("yyyy-MM-dd HH:mm")'
      }]
    }]
  }
})

// 创建评论
Mock.mock(/\/api\/comments/, 'post', {
  'code': 200,
  'message': '评论成功',
  'data': null
})

// 评论点赞
Mock.mock(/\/api\/comments\/\d+\/like/, 'post', {
  'code': 200,
  'message': '点赞成功',
  'data': null
})
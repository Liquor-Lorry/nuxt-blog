import Mock from 'mockjs'

// 设置延迟时间
Mock.setup({
  timeout: '200-600'
})

// 文章列表数据
Mock.mock(/\/api\/articles/, 'get', {
  'code': 200,
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

// 发布文章
Mock.mock('/api/articles', 'post', {
  'code': 200,
  'message': '发布成功',
  'data': {
    'id|+1': 1
  }
})

// 文章详情
Mock.mock(/\/api\/articles\/\d+/, 'get', {
  'code': 200,
  'data': {
    'id': '@natural(1, 100)',
    'title': '@ctitle(10, 30)',
    'content': '@cparagraph(20, 30)',
    'date': '@date("yyyy-MM-dd")',
    'views|100-10000': 1000,
    'category': '@ctitle(2,4)',
    'tags|2-4': ['@ctitle(2,4)'],
    'prev': {
      'id': '@natural(1, 100)',
      'title': '@ctitle(10, 20)'
    },
    'next': {
      'id': '@natural(1, 100)',
      'title': '@ctitle(10, 20)'
    }
  }
})

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
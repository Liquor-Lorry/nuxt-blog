import axios from 'axios'

export default {
  // 获取分类列表
  getCategories() {
    return axios.get('/api/categories');
  },
  // 获取文章列表
  getArticles(params = {}) {
    return axios.get('/api/articles', { params });
  },

  // 获取分类文章
  getArticlesByCategory(categoryId, params) {
    return axios.get(`/api/articles/category/${categoryId}`, { params })
  },

  // 获取单篇文章详情
  getArticleDetail(id) {
    return axios.get(`/api/articles/detail/${id}`)
  },

  // 获取单篇文章
  getArticle(id) {
    return axios.get(`/api/articles/${id}`)
  },

  // 发布文章
  createArticle(data) {
    return axios.post('/api/articles', data)
  },

  // 上传图片
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post('/api/upload', formData)
  },

  // 更新文章
  updateArticle(id, data) {
    return axios.put(`/api/articles/${id}`, data)
  },

  // 删除文章
  deleteArticle(id) {
    return axios.delete(`/api/articles/${id}`)
  },

  // 保存草稿
  saveDraft(articleData) {
    return axios.post('/api/articles/draft', articleData)
  }
}
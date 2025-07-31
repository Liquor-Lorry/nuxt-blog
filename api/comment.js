import axios from 'axios'

export default {
  // 获取文章评论
  getCommentsByArticle(articleId) {
    return axios.get(`/api/comments/article/${articleId}`)
  },

  // 创建评论
  createComment(data) {
    return axios.post('/api/comments', data)
  },

  // 评论点赞
  likeComment(commentId) {
    return axios.post(`/api/comments/${commentId}/like`)
  },

  // 回复评论
  replyToComment(data) {
    return axios.post('/api/comments/reply', data)
  }
}
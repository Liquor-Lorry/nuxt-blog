// plugins/api-repositories.js
export default ({ $axios }, inject) => {
    const repositories = {
      GetCategory: (params, options) => $axios.get('/categories', params, options),
      PostCategory: (params, options) => $axios.post('/categories', params, options),
      PutCategory: (params, options) => $axios.put(`/categories/${params.categoryId}`, params, options),
      DeleteCategory: (params, options) => $axios.delete(`/categories/${params.categoryId}`, params, options)
    }
  
    inject('https', repositories)
    // 外部使用: this.$https.GetCategory()
  }
  
<template>
  <div class="articles-container">
    <!-- 文章筛选区 -->
    <div class="filter-section">
      <el-card class="filter-card" shadow="never">
        <div class="filter-header">
          <div class="filter-title">
            <i class="el-icon-collection"></i>
            <span>文章列表</span>
            <span class="total-count">(共 {{ total }} 篇)</span>
          </div>
          <div class="filter-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索文章..."
              prefix-icon="el-icon-search"
              clearable
              @input="handleSearch"
              class="search-input">
            </el-input>
            <el-select v-model="selectedCategory" placeholder="选择分类" clearable @change="handleFilter">
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
              <el-option label="最新发布" value="newest"></el-option>
              <el-option label="最多阅读" value="popular"></el-option>
            </el-select>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 文章列表区 -->
    <div class="articles-list-wrapper">
      <div v-loading="loading" 
           class="articles-list"
           element-loading-text="加载中..."
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-card v-for="article in filteredArticles" 
                 :key="article.id" 
                 class="article-item"
                 :body-style="{ padding: '0px' }">
          <div class="article-cover" v-if="article.cover">
            <img :src="article.cover" :alt="article.title">
          </div>
          <div class="article-content">
            <h2 class="article-title" @click="goToDetail(article.id)">{{ article.title }}</h2>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="meta-item">
                <i class="el-icon-date"></i>
                {{ article.date }}
              </span>
              <span class="meta-item">
                <i class="el-icon-view"></i>
                {{ article.views }} 次阅读
              </span>
              <span class="meta-item">
                <i class="el-icon-collection-tag"></i>
                {{ article.category }}
              </span>
              <div class="article-tags">
                <el-tag 
                  v-for="tag in article.tags" 
                  :key="tag"
                  size="small"
                  effect="plain">
                  {{ tag }}
                </el-tag>
              </div>
              <div class="article-actions">
                <el-button 
                  type="text" 
                  size="small" 
                  icon="el-icon-edit"
                  @click.stop="handleEdit(article)">
                  编辑
                </el-button>
                <el-button 
                  type="text" 
                  size="small" 
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click.stop="handleDelete(article)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 无数据提示 -->
        <el-empty
          v-if="!loading && filteredArticles.length === 0"
          description="暂无相关文章"
          :image-size="200">
        </el-empty>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination-footer" v-if="!loading && filteredArticles.length > 0">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import articleApi from '@/api/article'
import debounce from 'lodash/debounce'

export default {
  name: 'Articles',
  data() {
    return {
      loading: false,
      articles: [],
      searchQuery: '',
      selectedCategory: '',
      sortBy: 'newest',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      categories: [
        { value: 'frontend', label: '前端开发' },
        { value: 'backend', label: '后端技术' },
        { value: 'tools', label: '工具使用' },
        { value: 'experience', label: '心得体会' }
      ]
    }
  },
  computed: {
    filteredArticles() {
      let result = [...this.articles]
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query)
        )
      }
      
      // 分类过滤
      if (this.selectedCategory) {
        result = result.filter(article => article.category === this.selectedCategory)
      }
      
      // 排序
      result.sort((a, b) => {
        if (this.sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date)
        } else {
          return b.views - a.views
        }
      })
      
      return result
    }
  },
  methods: {
    async fetchArticles() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          category: this.selectedCategory,
          keyword: this.searchQuery,
          sort: this.sortBy
        }
        const res = await articleApi.getArticles(params)
        if (res.data.code === 200) {
          const { list, total } = res.data.data
          this.articles = list
          this.total = total
        }
      } catch (error) {
        console.error('获取文章列表失败:', error)
        this.$message.error('获取文章列表失败')
      } finally {
        this.loading = false
      }
    },
    handleSearch: debounce(function() {
      this.currentPage = 1
      this.fetchArticles()
    }, 300),
    handleFilter() {
      this.currentPage = 1
      this.fetchArticles()
    },
    handleSort() {
      this.currentPage = 1
      this.fetchArticles()
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchArticles()
    },
    goToDetail(id) {
      this.$router.push(`/article/${id}`)
    },
    handleEdit(article) {
      this.$router.push(`/editor?id=${article.id}`)
    },
    async handleDelete(article) {
      try {
        await this.$confirm('确认删除该文章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await articleApi.deleteArticle(article.id)
        if (res.data.code === 200) {
          this.$message.success('删除成功')
          this.fetchArticles() // 重新获取列表
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除文章失败:', error)
          this.$message.error('删除文章失败')
        }
      }
    }
  },
  created() {
    this.fetchArticles()
  }
}
</script>

<style lang="scss" scoped>
.articles-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .filter-section {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #f4f5f5;
    
    .filter-card {
      margin-bottom: 0;
      border-radius: 4px;
      
      :deep(.el-card__body) {
        padding: 12px 15px;
      }
      
      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        
        .filter-title {
          display: flex;
          align-items: center;
          font-size: 15px;
          font-weight: 500;
          
          i {
            margin-right: 6px;
            font-size: 16px;
            color: #409EFF;
          }
          
          .total-count {
            margin-left: 6px;
            color: #909399;
            font-weight: normal;
            font-size: 13px;
          }
        }
        
        .filter-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          
          .search-input {
            width: 180px;
            
            :deep(.el-input__inner) {
              height: 32px;
              line-height: 30px;
              font-size: 13px;
            }
            
            :deep(.el-input__prefix) {
              line-height: 32px;
              
              i {
                line-height: 32px;
                font-size: 14px;
                vertical-align: middle;
              }
            }

            :deep(.el-input__suffix) {
              line-height: 32px;
              
              i {
                line-height: 32px;
                font-size: 14px;
                vertical-align: middle;
              }
            }
          }
          
          .el-select {
            width: 110px;
            
            :deep(.el-input__inner) {
              height: 32px;
              line-height: 30px;
              font-size: 13px;
            }
            
            :deep(.el-input__suffix) {
              line-height: 32px;
              
              .el-input__suffix-inner {
                line-height: 32px;
                
                i {
                  line-height: 32px;
                  font-size: 14px;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
    }
  }
  
  .articles-list-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;
    
    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #c0c4cc;
      border-radius: 3px;
      
      &:hover {
        background-color: #909399;
      }
    }
    
    &::-webkit-scrollbar-track {
      background-color: #f4f4f4;
    }
    
    .articles-list {
      min-height: 300px;
      
      .article-item {
        margin-bottom: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .article-cover {
          height: 200px;
          overflow: hidden;
          border-radius: 4px 4px 0 0;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
            
            &:hover {
              transform: scale(1.05);
            }
          }
        }
        
        .article-content {
          padding: 20px;
          
          .article-title {
            margin: 0 0 10px;
            font-size: 20px;
            color: #333;
            line-height: 1.4;
            cursor: pointer;
            
            &:hover {
              color: #409EFF;
            }
          }
          
          .article-summary {
            margin: 0 0 15px;
            font-size: 14px;
            color: #666;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
          }
          
          .article-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 13px;
            color: #999;
            
            .meta-item {
              display: flex;
              align-items: center;
              
              i {
                margin-right: 4px;
              }
            }
            
            .article-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin: 0 auto 0 0;
              
              .el-tag {
                border-radius: 12px;
                padding: 0 12px;
                height: 24px;
                line-height: 22px;
              }
            }
            
            .article-actions {
              margin-left: auto;
              display: flex;
              gap: 15px;
              
              .el-button {
                padding: 0;
                font-size: 13px;
                
                i {
                  margin-right: 4px;
                }
                
                &:hover {
                  color: #409EFF;
                }
                
                &.delete-btn {
                  color: #F56C6C;
                  
                  &:hover {
                    color: #f78989;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  .pagination-footer {
    position: sticky;
    bottom: 0;
    background: #f4f5f5;
    padding: 5px 0;
    display: flex;
    justify-content: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
}

@media screen and (max-width: 768px) {
  .articles-container {
    .filter-section {
      .filter-card {
        .filter-header {
          .filter-actions {
            width: 100%;
            
            .search-input,
            .el-select {
              width: 100%;
            }
          }
        }
      }
    }
    .articles-list-wrapper {
      .articles-list {
        .article-item {
          .article-content {
            .article-meta {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
              
              .article-tags {
                margin: 0;
                width: 100%;
              }
              
              .article-actions {
                margin: 0;
                width: 100%;
                justify-content: flex-end;
              }
            }
          }
        }
      }
    }
  }
}
</style> 
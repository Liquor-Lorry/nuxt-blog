<template>
  <div class="archives-container">
    <el-card class="archives-card">
      <div slot="header">
        <div class="header-content">
          <span>文章归档</span>
          <el-input
            placeholder="搜索文章..."
            v-model="searchQuery"
            prefix-icon="el-icon-search"
            clearable
            @input="handleSearch"
            class="search-input">
          </el-input>
        </div>
      </div>
      
      <el-timeline>
        <el-timeline-item
          v-for="group in groupedArticles"
          :key="group.year"
          :timestamp="group.year"
          placement="top">
          <el-card>
            <h3>{{ group.year }} ({{ group.articles.length }}篇)</h3>
            <ul class="article-list">
              <li v-for="article in group.articles" :key="article.id">
                <span class="article-date">{{ article.date.split('-').slice(1).join('-') }}</span>
                <nuxt-link :to="`/article/detail/${article.id}`" class="article-title">
                  {{ article.title }}
                </nuxt-link>
                <el-tag :type="getCategoryType(article.category)" size="small" >{{ article.categoryName }}</el-tag>
              </li>
            </ul>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
import articleApi from '@/api/article'

export default {
  name: 'Archives',
  async asyncData() {
    try {
      const { data } = await articleApi.getArticles({ sort: 'newest', pageSize: 1000 })
      return { articles: data.data.articles || [] }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
      return { articles: [] }
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredArticles() {
      if (!this.searchQuery) return this.articles
      const query = this.searchQuery.toLowerCase()
      return this.articles.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      )
    },
    groupedArticles() {
      const groups = {}
      // 按年份分组并排序文章
      this.filteredArticles.forEach(article => {
        const year = article.date.split('-')[0]
        if (!groups[year]) groups[year] = []
        groups[year].push(article)
      })
      // 转换为数组并按年份降序排列
      return Object.entries(groups)
        .map(([year, articles]) => ({
          year,
          articles: articles.sort((a, b) => new Date(b.date) - new Date(a.date))
        }))
        .sort((a, b) => b.year - a.year)
    }
  },
  methods: {
    handleSearch() {
      // 可以添加防抖处理
    },
    getCategoryType(category) {
      const typeMap = {
        'frontend': 'success',
        'backend': 'danger',
        'life': 'primary',
        'tools': 'warning',
        'experience': 'primary',
        'other': 'info'
      };
      return typeMap[category] || 'other';
    }
  }
}
</script>

<style lang="scss" scoped>
.archives-container {
  .archives-card {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .search-input {
        width: 200px;
      }
    }
    
    .article-list {
      list-style: none;
      padding: 0;
      
      li {
        display: flex;
        align-items: center;
        margin: 10px 0;
        
        .article-date {
          color: #999;
          margin-right: 15px;
          font-size: 14px;
        }
        
        .article-title {
          flex: 1;
          color: #333;
          text-decoration: none;
          
          &:hover {
            color: #409EFF;
          }
        }
        
        .article-category {
          margin-left: 15px;
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .archives-container {
    .archives-card {
      .header-content {
        flex-direction: column;
        gap: 10px;
        
        .search-input {
          width: 100%;
        }
      }
      
      .article-list {
        li {
          flex-wrap: wrap;
          
          .article-date {
            width: 100%;
            margin-bottom: 5px;
          }
          
          .article-category {
            width: 100%;
            margin-left: 0;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
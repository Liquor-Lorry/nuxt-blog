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
          v-for="(yearGroup, year) in groupedArticles"
          :key="year"
          :timestamp="year"
          placement="top">
          <el-card>
            <h3>{{ year }} ({{ yearGroup.length }}篇)</h3>
            <ul class="article-list">
              <li v-for="article in yearGroup" :key="article.id">
                <span class="article-date">{{ article.date.split('-').slice(1).join('-') }}</span>
                <nuxt-link :to="`/article/${article.id}`" class="article-title">
                  {{ article.title }}
                </nuxt-link>
                <span class="article-category">{{ article.category }}</span>
              </li>
            </ul>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Archives',
  data() {
    return {
      searchQuery: '',
      articles: [
        {
          id: 1,
          title: 'Nuxt.js详细教程',
          date: '2024-03-20',
          category: '前端开发'
        },
        {
          id: 2,
          title: 'Vue3组件开发实践',
          date: '2024-02-15',
          category: '前端开发'
        },
        {
          id: 3,
          title: '2023年度技术总结',
          date: '2023-12-31',
          category: '心得体会'
        }
        // 更多文章...
      ]
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
      this.filteredArticles.forEach(article => {
        const year = article.date.split('-')[0]
        if (!groups[year]) groups[year] = []
        groups[year].push(article)
      })
      return groups
    }
  },
  methods: {
    handleSearch() {
      // 可以添加防抖处理
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
<template>
  <div class="categories-container">
    <el-card class="categories-card">
      <div slot="header">
        <span>文章分类</span>
      </div>
      
      <div class="category-list">
        <el-tag
          v-for="category in categories"
          :key="category.name"
          :type="category.type"
          effect="dark"
          class="category-item"
          @click="handleCategoryClick(category)">
          {{ category.name }}
          <span class="category-count">({{ category.count }})</span>
        </el-tag>
      </div>
      
      <div class="article-list" v-if="selectedCategory">
        <h3>{{ selectedCategory.name }}下的文章</h3>
        <el-timeline>
          <el-timeline-item
            v-for="article in categoryArticles"
            :key="article.id"
            :timestamp="article.date"
            placement="top">
            <el-card>
              <h4>
                <nuxt-link :to="`/article/${article.id}`">
                  {{ article.title }}
                </nuxt-link>
              </h4>
              <p>{{ article.summary }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      categories: [
        { name: '前端开发', count: 12, type: '' },
        { name: '后端技术', count: 8, type: 'success' },
        { name: '工具使用', count: 5, type: 'warning' },
        { name: '心得体会', count: 3, type: 'info' }
      ],
      selectedCategory: null,
      categoryArticles: []
    }
  },
  methods: {
    handleCategoryClick(category) {
      this.selectedCategory = category
      // 模拟获取分类下的文章
      this.categoryArticles = [
        {
          id: 1,
          title: '文章标题1',
          date: '2024-03-20',
          summary: '文章简介...'
        },
        // 更多文章...
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.categories-container {
  .categories-card {
    .category-list {
      margin-bottom: 30px;
      
      .category-item {
        margin: 0 10px 10px 0;
        cursor: pointer;
        
        .category-count {
          margin-left: 5px;
        }
      }
    }
    
    .article-list {
      h3 {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      a {
        color: #333;
        text-decoration: none;
        
        &:hover {
          color: #409EFF;
        }
      }
    }
  }
}
</style> 
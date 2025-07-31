<template>
  <div class="categories-container">
    <el-card class="categories-card">
      <div slot="header">
        <span>文章分类</span>
      </div>
      
      <div class="category-list">
        <el-tag
          v-for="category in categories"
          :key="category.value"
          :type="category.type"
          effect="dark"
          class="category-item"
          @click="handleCategoryClick(category)">
          {{ category.label }}
          <span class="category-count">({{ category.count }})</span>
        </el-tag>
      </div>
      
      <div class="article-list" v-if="selectedCategory">
        <h3>{{ selectedCategory.label }}下的文章</h3>
        <el-timeline>
          <el-timeline-item
            v-for="article in categoryArticles"
            :key="article.id"
            :timestamp="article.date"
            placement="top">
            <el-card>
              <h4>
                <nuxt-link :to="`/article/detail/${article.id}`">
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
import articleApi from '@/api/article'

export default {
    async asyncData() {
      try {
        const res = await articleApi.getCategories();
        return {
          categories: res.data.data || []
        };
      } catch (error) {
        console.error('获取分类失败:', error);
        return { categories: [] };
      }
    },
  name: 'Categories',
  data() {
    return {
      categories: [],
      selectedCategory: null,
      categoryArticles: []
    }
  },
  methods: {
    async handleCategoryClick(category) {
      this.selectedCategory = category
      try {
        const res = await articleApi.getArticles({ category: category.value });
        if (res.data.code === 'success') {
          this.categoryArticles = res.data.data.articles || [];
        } else {
          this.categoryArticles = [];
        }
      } catch (error) {
        console.error('获取分类文章失败:', error);
        this.categoryArticles = [];
      }
    }
  },
  mounted() {
    // 页面加载完成后自动选择第一个分类
    if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0];
      this.handleCategoryClick(this.categories[0]);
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
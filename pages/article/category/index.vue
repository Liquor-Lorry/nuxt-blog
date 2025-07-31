<template>
  <div class="category-articles">
    <el-card class="page-header">
      <h1>{{ categoryName }} 文章列表</h1>
      <p>共 {{ articles.length }} 篇相关文章</p>
    </el-card>

    <div class="articles-list">
      <el-card v-for="article in articles" :key="article.id" class="article-item">
        <div class="article-content">
          <h2 @click="goToDetail(article.id)">{{ article.title }}</h2>
          <div class="article-meta">
            <span><i class="el-icon-date"></i> {{ article.date }}</span>
            <span><i class="el-icon-view"></i> {{ article.views }} 阅读</span>
          </div>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-tags">
            <el-tag v-for="tag in article.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
          </div>
        </div>
      </el-card>

      <el-empty v-if="articles.length === 0" description="该分类下暂无文章"></el-empty>
    </div>

    <div class="pagination" v-if="total > pageSize">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="fetchArticles"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import articleApi from '@/api/article'

export default {
  name: 'CategoryArticles',
  async asyncData({ params, error }) {
    try {
      const { data } = await articleApi.getArticlesByCategory(params.categoryId)
      return {
        articles: data.articles,
        total: data.total,
        categoryName: data.categoryName
      }
    } catch (err) {
      error({ statusCode: 404, message: '分类不存在或已删除' })
    }
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1
    }
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/article/detail/${id}`)
    },
    async fetchArticles(page) {
      this.currentPage = page
      const { data } = await articleApi.getArticlesByCategory(
        this.$route.params.categoryId,
        { page, pageSize: this.pageSize }
      )
      this.articles = data.articles
      this.total = data.total
    }
  }
}
</script>

<style lang="scss" scoped>
.category-articles {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;
    text-align: center;
    padding: 30px 0;
  }

  .articles-list {
    .article-item {
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .article-content {
        padding: 20px;

        h2 {
          margin: 0 0 15px;
          color: #333;
          font-size: 18px;
        }

        .article-meta {
          color: #999;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .article-summary {
          color: #666;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }

  .pagination {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
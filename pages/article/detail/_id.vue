<template>
  <div class="article-detail-page">
    <el-card class="article-detail-card">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span><i class="el-icon-date"></i> {{ article.date }}</span>
        <span><i class="el-icon-view"></i> {{ article.views }} 阅读</span>
        <span><i class="el-icon-collection-tag"></i> {{ article.categoryName }}</span>
      </div>

      <!-- 使用markdown编辑器渲染数据 保证数据样式完整性 -->
      <mavon-editor
        class="article-content"
        :value="article.content"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :scrollStyle="true"
      ></mavon-editor>

      <div class="article-tags">
        <el-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</el-tag>
      </div>
    </el-card>

    <!-- 文章导航 -->
    <div class="article-navigation" v-if="article.prev || article.next">
      <el-card shadow="never">
        <div class="nav-prev" v-if="article.prev">
          <span>上一篇：</span>
          <nuxt-link :to="`/article/detail/${article.prev.id}`">{{ article.prev.title }}</nuxt-link>
        </div>
        <div class="nav-next" v-if="article.next">
          <span>下一篇：</span>
          <nuxt-link :to="`/article/detail/${article.next.id}`">{{ article.next.title }}</nuxt-link>
        </div>
      </el-card>
    </div>

    <!-- 评论区 -->
    <div class="comment-section">
      <el-card>
        <h3 slot="header"><i class="el-icon-comment"></i> 评论区</h3>
        <CommentList :article-id="article?.id || ''" ref="commentList" />
        <CommentForm :article-id="article?.id || ''" @comment-added="refreshComments" />
      </el-card>
    </div>
  </div>
</template>

<script>
import articleApi from '@/api/article'
import CommentList from '@/components/CommentList.vue'
import CommentForm from '@/components/CommentForm.vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'ArticleDetail',
  components: {
    CommentList,
    CommentForm
  },
  async asyncData({ params, error }) {
    try {
        if (!params.id) {
          error({ statusCode: 400, message: '文章ID参数缺失' })
          return { article: {} }
        }
        const response = await articleApi.getArticleDetail(params.id)
        if (response.data.code !== 'success') {
          throw new Error(response.data?.message || '获取文章详情失败')
        }
        const articleData = response.data.data || {}
        const normalizedData = Array.isArray(articleData) ? articleData[0] || {} : articleData
        // 确保所有必要字段都有默认值
        normalizedData.title = normalizedData.title || '未命名文章'
        normalizedData.content = normalizedData.content || '<p>文章内容为空</p>'
        normalizedData.date = normalizedData.date || new Date().toLocaleDateString()
        normalizedData.views = normalizedData.views || 0
        normalizedData.category = normalizedData.category || ''
        normalizedData.categoryName = normalizedData.categoryName || '未分类'
        normalizedData.tags = Array.isArray(normalizedData.tags) ? normalizedData.tags : []
        return { article: normalizedData } 
      } catch (err) {
        error({ statusCode: 404, message: '文章不存在或已删除' })
        return { article: {} }
      }
  },
  methods: {
    refreshComments() {
      this.$refs.commentList.fetchComments()
    }
  }
}
</script>

<style lang="scss" scoped>
.article-detail-page {
  padding: 20px;

  .article-detail-card {
    margin-bottom: 20px;

    .article-title {
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }

    .article-meta {
      color: #999;
      font-size: 14px;
      margin-bottom: 20px;
      text-align: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;

      span {
        margin: 0 10px;
      }
    }

    .article-content {
      padding: 20px 0;
      line-height: 1.8;
      color: #333;
      font-size: 16px;

      img {
        max-width: 100%;
        margin: 15px 0;
      }

      h2, h3 {
        margin: 15px 0;
      }
    }

    .article-tags {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #eee;

      .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }

  .article-navigation {
    margin-bottom: 30px;

    .nav-prev, .nav-next {
      padding: 10px 0;
    }

    a {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .comment-section {
    margin-top: 30px;
  }
}
</style>
<template>
  <div class="article-detail">
    <el-card class="article-card">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-info">
        <span><i class="el-icon-date"></i> {{ article.date }}</span>
        <span><i class="el-icon-view"></i> {{ article.views }} 阅读</span>
        <span><i class="el-icon-collection-tag"></i> {{ article.category }}</span>
      </div>
      <div class="article-content" v-html="article.content"></div>
      
      <!-- 文章标签 -->
      <div class="article-tags">
        <el-tag v-for="tag in article.tags" 
                :key="tag"
                size="small"
                class="tag-item">
          {{ tag }}
        </el-tag>
      </div>
      
      <!-- 上一篇/下一篇 -->
      <div class="article-navigation">
        <div v-if="article.prev" class="prev">
          <span>上一篇：</span>
          <nuxt-link :to="`/article/${article.prev.id}`">
            {{ article.prev.title }}
          </nuxt-link>
        </div>
        <div v-if="article.next" class="next">
          <span>下一篇：</span>
          <nuxt-link :to="`/article/${article.next.id}`">
            {{ article.next.title }}
          </nuxt-link>
        </div>
      </div>
      
      <!-- 评论区 -->
      <div class="comment-section">
        <h3>评论</h3>
        <el-form :model="commentForm" ref="commentForm">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入评论"
            v-model="commentForm.content">
          </el-input>
          <el-button type="primary" @click="submitComment" class="submit-btn">
            提交评论
          </el-button>
        </el-form>
        
        <!-- 评论列表 -->
        <div class="comment-list">
          <div v-for="comment in comments" 
               :key="comment.id" 
               class="comment-item">
            <el-avatar :size="40" :src="comment.avatar"></el-avatar>
            <div class="comment-content">
              <div class="comment-header">
                <span class="username">{{ comment.username }}</span>
                <span class="time">{{ comment.time }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleDetail',
  async asyncData({ params, $axios }) {
    // 这里模拟从API获取数据
    const article = {
      id: params.id,
      title: 'Nuxt.js详细教程',
      date: '2024-03-20',
      views: 1234,
      category: '前端开发',
      tags: ['Vue', 'Nuxt', 'JavaScript'],
      content: `
        <h2>什么是Nuxt.js？</h2>
        <p>Nuxt.js 是一个基于 Vue.js 的通用应用框架。</p>
        <h2>为什么选择Nuxt.js？</h2>
        <p>通过对服务端渲染的支持，Nuxt.js 可以让你的 Vue 应用获得更好的 SEO 效果...</p>
      `,
      prev: { id: 1, title: 'Vue.js基础入门' },
      next: { id: 3, title: 'Element UI组件使用指南' }
    }
    
    return { article }
  },
  
  data() {
    return {
      commentForm: {
        content: ''
      },
      comments: [
        {
          id: 1,
          username: '用户A',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          time: '2024-03-20 14:30',
          content: '文章写得很好，学习了！'
        }
      ]
    }
  },
  
  methods: {
    submitComment() {
      // 提交评论逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
.article-detail {
  .article-card {
    padding: 20px;
    
    .article-title {
      font-size: 28px;
      margin-bottom: 20px;
    }
    
    .article-info {
      color: #999;
      margin-bottom: 30px;
      
      span {
        margin-right: 20px;
        i {
          margin-right: 5px;
        }
      }
    }
    
    .article-content {
      line-height: 1.8;
      margin-bottom: 30px;
    }
    
    .article-tags {
      margin: 20px 0;
      
      .tag-item {
        margin-right: 10px;
      }
    }
    
    .article-navigation {
      border-top: 1px solid #eee;
      padding-top: 20px;
      margin-top: 20px;
      
      .prev, .next {
        margin: 10px 0;
        
        a {
          color: #409EFF;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .comment-section {
      margin-top: 40px;
      
      .submit-btn {
        margin-top: 15px;
      }
      
      .comment-list {
        margin-top: 30px;
        
        .comment-item {
          display: flex;
          margin-bottom: 20px;
          
          .comment-content {
            margin-left: 15px;
            flex: 1;
            
            .comment-header {
              margin-bottom: 5px;
              
              .username {
                font-weight: bold;
                margin-right: 10px;
              }
              
              .time {
                color: #999;
                font-size: 12px;
              }
            }
            
            .comment-text {
              margin: 0;
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style> 
<template>
  <div class="home-container">
    <!-- 顶部 Banner -->
    <div class="banner-section">
      <el-carousel height="300px" :interval="5000">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <el-row :gutter="20">
      <!-- 左侧主要内容区 -->
      <el-col :span="16">
        <!-- 推荐文章 -->
        <div class="featured-articles">
          <div class="section-header">
            <h3><i class="el-icon-star-on"></i> 推荐文章</h3>
          </div>
          <el-row :gutter="20">
            <el-col :span="12" v-for="article in featuredArticles" :key="article.id">
              <el-card class="featured-item" @click.native="readMore(article.id)">
                <img :src="article.cover" class="featured-image">
                <div class="featured-info">
                  <h4>{{ article.title }}</h4>
                  <p>{{ article.summary }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 最新文章列表 -->
        <div class="latest-articles">
          <div class="section-header">
            <h3><i class="el-icon-time"></i> 最新文章</h3>
          </div>
          <el-card v-for="article in articles" 
                  :key="article.id" 
                  class="article-item"
                  @click.native="readMore(article.id)">
            <div class="article-content">
              <h2>{{ article.title }}</h2>
              <p class="article-meta">
                <span><i class="el-icon-date"></i> {{ article.date }}</span>
                <span><i class="el-icon-view"></i> {{ article.views }} 阅读</span>
                <span><i class="el-icon-collection-tag"></i> {{ article.category }}</span>
              </p>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-tags">
                <el-tag v-for="tag in article.tags" 
                        :key="tag" 
                        size="small"
                        effect="plain">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      
      <!-- 右侧边栏 -->
      <el-col :span="8">
        <!-- 个人简介 -->
        <el-card class="sidebar-card profile-card">
          <div class="profile">
            <el-avatar :size="100" :src="require('@/assets/images/avatar.jpg')"></el-avatar>
            <h4>Lorry</h4>
            <p>前端开发工程师，热爱技术分享</p>
            <div class="profile-stats">
              <div class="stat-item">
                <h5>文章</h5>
                <span>{{ stats.articles }}</span>
              </div>
              <div class="stat-item">
                <h5>分类</h5>
                <span>{{ stats.categories }}</span>
              </div>
              <div class="stat-item">
                <h5>标签</h5>
                <span>{{ stats.tags }}</span>
              </div>
            </div>
          </div>
        </el-card>
        
        <!-- 标签云 -->
        <el-card class="sidebar-card">
          <div slot="header">
            <h3><i class="el-icon-collection-tag"></i> 标签云</h3>
          </div>
          <div class="tag-cloud">
            <el-tag v-for="tag in tags" 
                    :key="tag.name"
                    :type="tag.type"
                    size="small"
                    class="tag-item"
                    @click="filterByTag(tag.name)">
              {{ tag.name }}
              <span class="tag-count">({{ tag.count }})</span>
            </el-tag>
          </div>
        </el-card>

        <!-- 热门文章 -->
        <el-card class="sidebar-card">
          <div slot="header">
            <h3><i class="el-icon-hot-water"></i> 热门文章</h3>
          </div>
          <ul class="popular-list">
            <li v-for="article in popularArticles" 
                :key="article.id"
                @click="readMore(article.id)">
              <span class="article-title">{{ article.title }}</span>
              <span class="view-count">
                <i class="el-icon-view"></i> {{ article.views }}
              </span>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      banners: [
        {
          id: 1,
          title: '技术探索之旅',
          description: '分享前端开发的心得体会与技术积累',
          image: 'https://picsum.photos/1200/300'
        },
        {
          id: 2,
          title: '学习成长之路',
          description: '记录每一步的进步与收获',
          image: 'https://picsum.photos/1200/300?random=1'
        }
      ],
      featuredArticles: [
        {
          id: 1,
          title: 'Vue3 组件开发最佳实践',
          summary: '深入探讨 Vue3 组件开发的技巧和注意事项...',
          cover: 'https://picsum.photos/300/200'
        },
        {
          id: 2,
          title: 'TypeScript 高级特性解析',
          summary: '详细讲解 TypeScript 中的高级类型和使用技巧...',
          cover: 'https://picsum.photos/300/200?random=2'
        }
      ],
      stats: {
        articles: 108,
        categories: 12,
        tags: 56
      },
      popularArticles: [
        {
          id: 1,
          title: '深入理解 Vue.js 响应式原理',
          views: 3500
        },
        {
          id: 2,
          title: 'JavaScript 性能优化技巧',
          views: 2800
        },
        {
          id: 3,
          title: '前端工程化实践指南',
          views: 2300
        }
      ],
      tags: [
        { name: 'Vue', type: 'success', count: 25 },
        { name: 'JavaScript', type: '', count: 32 },
        { name: 'Flutter', type: 'info', count: 12 },
        { name: 'Nuxt', type: 'danger', count: 15 },
        { name: 'TypeScript', type: 'warning', count: 20 },
        { name: 'Node.js', type: 'success', count: 22 }
      ],
      articles: [
        {
          id: 1,
          title: '深入浅出 Vue3 Composition API',
          summary: '本文将详细介绍 Vue3 Composition API 的使用方法和最佳实践，帮助你更好地组织和复用组件逻辑...',
          date: '2024-03-20',
          views: 1580,
          category: '前端开发',
          tags: ['Vue3', 'JavaScript', 'Composition API']
        },
        {
          id: 2,
          title: 'Flutter 状态管理方案对比',
          summary: '对比分析 Flutter 中常用的几种状态管理方案，包括 Provider、Riverpod、GetX 等，帮助你选择最适合的方案...',
          date: '2024-03-18',
          views: 1280,
          category: '移动开发',
          tags: ['Flutter', 'Dart', '状态管理']
        },
        {
          id: 3,
          title: 'Nuxt3 实战：搭建个人博客',
          summary: '从零开始，使用 Nuxt3 搭建一个功能完善的个人博客系统，包含文章管理、评论系统等功能...',
          date: '2024-03-15',
          views: 2100,
          category: '实战教程',
          tags: ['Nuxt', 'Vue3', 'SSR']
        },
        {
          id: 4,
          title: 'TypeScript 高级类型实战',
          summary: '探索 TypeScript 中的高级类型用法，包括映射类型、条件类型、类型推导等，提升代码的类型安全性...',
          date: '2024-03-12',
          views: 1850,
          category: '前端开发',
          tags: ['TypeScript', 'JavaScript']
        },
        {
          id: 5,
          title: 'Node.js 性能优化实践',
          summary: '分享在 Node.js 项目中常用的性能优化技巧，包括内存管理、异步操作、缓存策略等...',
          date: '2024-03-10',
          views: 1620,
          category: '后端开发',
          tags: ['Node.js', 'JavaScript', '性能优化']
        }
      ]
    }
  },
  methods: {
    readMore(id) {
      this.$router.push(`/article/${id}`)
    },
    filterByTag(tag) {
      this.$router.push({
        path: '/articles',
        query: { tag }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  .banner-section {
    margin-bottom: 30px;
    
    .banner-item {
      height: 300px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      padding: 0 50px;
      
      .banner-content {
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        
        h2 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        p {
          font-size: 18px;
          opacity: 0.9;
        }
      }
    }
  }

  .section-header {
    margin-bottom: 20px;
    
    h3 {
      font-size: 20px;
      color: #333;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 8px;
        color: #409EFF;
      }
    }
  }

  .featured-articles {
    margin-bottom: 30px;
    
    .featured-item {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .featured-image {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 4px;
      }
      
      .featured-info {
        padding: 15px 0 0;
        
        h4 {
          margin: 0 0 10px;
          font-size: 16px;
          color: #333;
        }
        
        p {
          margin: 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }

  .latest-articles {
    margin-bottom: 30px;

    .article-item {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      margin-bottom: 20px;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .article-content {
        padding: 20px;

        h2 {
          margin: 0 0 10px;
          font-size: 18px;
          color: #333;
        }

        .article-meta {
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;

          span {
            margin-right: 15px;
          }
        }

        .article-summary {
          margin: 0 0 15px;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .el-tag {
            border-radius: 12px;
            padding: 0 10px;
            height: 24px;
            line-height: 22px;
          }
        }
      }
    }
  }

  .sidebar-card {
    margin-bottom: 20px;
    
    .profile {
      text-align: center;
      
      .el-avatar {
        margin-bottom: 15px;
      }
      
      h4 {
        margin: 0 0 10px;
        font-size: 18px;
        color: #333;
      }
      
      p {
        color: #666;
        margin-bottom: 20px;
      }
      
      .profile-stats {
        display: flex;
        justify-content: space-around;
        border-top: 1px solid #eee;
        padding-top: 15px;
        
        .stat-item {
          text-align: center;
          
          h5 {
            margin: 0;
            font-size: 14px;
            color: #999;
          }
          
          span {
            font-size: 20px;
            color: #409EFF;
            font-weight: bold;
          }
        }
      }
    }
    
    .tag-cloud {
      .tag-item {
        margin: 0 10px 10px 0;
        cursor: pointer;
        
        .tag-count {
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    
    .popular-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          .article-title {
            color: #409EFF;
          }
        }
        
        .article-title {
          flex: 1;
          margin-right: 15px;
          color: #333;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .view-count {
          color: #999;
          font-size: 13px;
          
          i {
            margin-right: 4px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .home-container {
    .banner-section {
      .banner-item {
        padding: 0 20px;
        
        .banner-content {
          h2 {
            font-size: 24px;
          }
          
          p {
            font-size: 16px;
          }
        }
      }
    }
    
    .el-col-16 {
      width: 100%;
    }
    
    .el-col-8 {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="layout-container">
    <!-- 导航栏 -->
    <nav class="nav-wrapper">
      <div class="nav-content">
        <div class="logo">
          <nuxt-link to="/">
            <h1>Lorry's Blog</h1>
          </nuxt-link>
        </div>
        <el-menu 
          mode="horizontal" 
          :router="true" 
          :default-active="activeMenu"
          class="nav-menu">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/articles">文章</el-menu-item>
          <el-menu-item index="/categories">分类</el-menu-item>
          <el-menu-item index="/archives">归档</el-menu-item>
          <el-menu-item index="/about">关于我</el-menu-item>
        </el-menu>
        <div class="nav-actions">
          <GlobalSearch class="nav-search" />
          <el-button 
            type="primary" 
            icon="el-icon-edit"
            @click="$router.push('/editor')"
            class="write-btn">
            写文章
          </el-button>
        </div>
      </div>
    </nav>

    <!-- 内容区 -->
    <main class="content-wrapper">
      <div class="content-scroll">
        <Nuxt keep-alive :keep-alive-props="{ include: ['Home', 'Articles', 'Categories', 'Archives', 'About'] }" />
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer-wrapper">
      <div class="footer-content">
        <div class="footer-links">
          <el-tag 
            v-for="link in footerLinks" 
            :key="link.url"
            :type="link.type"
            effect="plain"
            class="footer-link-tag"
            @click="openLink(link.url)">
            <i :class="link.icon"></i>
            {{ link.name }}
          </el-tag>
        </div>
        <p class="copyright">© 2025 Lorry's Blog. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import GlobalSearch from '~/components/GlobalSearch.vue'

export default {
  name: 'DefaultLayout',
  components: {
    GlobalSearch
  },
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  data() {
    return {
      footerLinks: [
        { 
          name: 'GitHub',
          url: 'https://github.com/Liquor-Lorry',
          icon: 'el-icon-position',
          type: ''
        },
        { 
          name: 'Twitter',
          url: 'https://twitter.com',
          icon: 'el-icon-share',
          type: 'info'
        },
        { 
          name: 'RSS',
          url: '/rss',
          icon: 'el-icon-bell',
          type: 'warning'
        },
        { 
          name: 'Email',
          url: 'https://mail.google.com/',
          icon: 'el-icon-message',
          type: 'success'
        }
      ]
    }
  },
  methods: {
    openLink(url) {
      if (url.startsWith('mailto:')) {
        window.location.href = url;
      } else {
        window.open(url, '_blank');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f4f5f5;
  width: 100%;
  position: relative;
  overflow: hidden;

  .nav-wrapper {
    height: var(--nav-height);
    flex-shrink: 0;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 100;
    
    .nav-content {
      height: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      padding: 0 20px;

      .logo {
        margin-right: 40px;
        a {
          text-decoration: none;
          
          h1 {
            font-size: 24px;
            margin: 0;
            background: linear-gradient(
              120deg,
              #ff0080 0%,    /* 亮粉色 */
              #ff8c00 20%,   /* 亮橙色 */
              #40e0d0 40%,   /* 绿松石色 */
              #7b68ee 60%,   /* 中板岩蓝 */
              #ff0080 80%    /* 回到亮粉色 */
            );
            background-size: 300% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            display: inline-block;
            animation: gradient 6s linear infinite;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            
            /* 双层光效 */
            &::before, &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }

            /* 主光效 */
            &::before {
              background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.8) 50%,
                transparent 100%
              );
              transform: translateX(-100%);
              animation: shine 3s ease-in-out infinite;
              filter: blur(3px);
            }

            /* 辉光效果 */
            &::after {
              background: radial-gradient(
                circle at 50% 50%,
                rgba(255, 255, 255, 0.2) 0%,
                transparent 50%
              );
              animation: glow 2s ease-in-out infinite alternate;
              filter: blur(5px);
            }
          }
        }
      }

      .nav-menu {
        border: none;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-left: auto;

        .write-btn {
          border-radius: 20px;
          padding: 8px 16px;
        }
      }
    }
  }

  .content-wrapper {
    flex: 1;
    position: relative;
    overflow: hidden;
    padding: 20px;
    
    .content-scroll {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      
      &::-webkit-scrollbar {
        width: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
      }
      
      > div {
        min-height: 100%;
      }
    }
  }

  .footer-wrapper {
    height: var(--footer-height);
    flex-shrink: 0;
    background: #fff;
    color: #666;
    padding: 15px 20px;
    position: relative;
    z-index: 1;
    
    .footer-content {
      height: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      .footer-links {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 15px;
        
        .footer-link-tag {
          cursor: pointer;
          padding: 8px 15px;
          border-radius: 20px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
          
          i {
            margin-right: 6px;
            font-size: 16px;
            display: inline-flex;
            align-items: center;
          }
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }
      }
      
      .copyright {
        color: #909399;
        font-size: 14px;
        text-align: center;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .layout-container {
    .content-wrapper {
      padding: 15px;
    }
  }

  .footer-wrapper {
    .footer-content {
      .footer-links {
        padding: 0 10px;
        
        .footer-link-tag {
          padding: 6px 12px;
          font-size: 13px;
        }
      }
    }
  }
}

/* 渐变动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 光效动画 */
@keyframes shine {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  80% {
    opacity: 0;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 辉光动画 */
@keyframes glow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}
</style> 
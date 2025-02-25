<template>
  <div class="http404-container">
    <div class="http404" v-if="error.statusCode == 404">
      <img src="@/assets/images/404.png" alt="404" class="pic-404" />
      <div class="bullshit">
        <div class="bullshit__headline">{{ message }}</div>

        <ul>
          <li><nuxt-link to="/">返回首页</nuxt-link></li>
        </ul>
      </div>
    </div>
    <h2 v-else>500服务器错误</h2>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  layout: 'default',
  transition: 'error-page',
  data() {
    return {
      message: "抱歉，您访问的页面不存在或无权访问!",
    };
  },
  props: ["error"],
};
</script>

<style lang="scss" scoped>
.http404-container {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.http404 {
  .pic-404 {
    width: 400px;
  }
  .bullshit {
    position: relative;
    margin-bottom: 80px;
    text-align: center;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #9e9e9e;
      opacity: 0;
      margin-bottom: 25px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 40px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      float: left;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}

.error-page {
  min-height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <div class="container">
    <div class="mb-10">
      <NuxtLogo />
    </div>
    <ul>
      <li class="mb-5">
        <nuxt-link :to="{ name: 'blog' }">去往博客页面</nuxt-link>
      </li>
      <li class="mb-5">
        <nuxt-link :to="{ name: 'mine' }">去往我的页面</nuxt-link>
      </li>
      <li class="mb-5">
        <nuxt-link :to="{ name: 'news' }">去往消息页面</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NuxtTutorial",
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

<template>
  <div>
    <h2>News-Content： {{ content }}</h2>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id);
  },
  data() {
    return {
      title: this.$route.params.title,
      content: this.$route.params.content,
    };
  },
  // //独立设置head信息
  // head() {
  //   return {
  //     title: this.title,
  //     meta: [
  //       { hid: "description", name: "news", content: "This is news page" },
  //     ],
  //   };
  // },
  // 调用全局方法设置head
  head() {
    return this.$seo(this.title, this.content)
}
};
</script>

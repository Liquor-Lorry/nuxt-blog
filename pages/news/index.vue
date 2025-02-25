<template>
  <div>
    <div>news</div>
    <ul>
      <li>
        <nuxt-link
          :to="{ name: 'news-id', params: { id: 123, title: 'lorry.com', content: 'this is content' } }"
          >News-1</nuxt-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style></style>

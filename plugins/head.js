// plugins/head.js
import Vue from 'vue'

// 动态设置每个页面的head
Vue.mixin({
  methods: {
    $seo(title, content) {
      return {
        title,
        meta: [{
          hid: 'description',
          name: 'description',
          content
        }]
      }
    }
  }
})

export default function ({ store }) {
  // 移除或修改这个插件
  // 如果不需要这个插件，可以直接在 nuxt.config.js 中移除它
}

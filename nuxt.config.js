export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '我的博客',
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "我的个人博客网站" },
      { name: "format-detection", content: "telephone=no" },
    ],
    loading: {
      color: '#409EFF',
      height: '2px',
      continuous: true,
      duration: 3000,
      throttle: 200
    },
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "element-ui/lib/theme-chalk/index.css",
    "@/assets/css/common.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/element-ui",
    "@/plugins/axios",
    { src: '~/plugins/api-repositories.js', ssr: true },
    '~/plugins/app.js',
    { src: '@/plugins/mavon-editor', ssr: false },
    // { src: '@/plugins/mock', ssr: false } // 禁用mock.js插件，使用真实API数据
  ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
   axios: {
    baseURL: ''
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // $production: {
  //   routeRules: {
  //     //isr: true 允许你在构建网站后创建或更新静态页面,意味着我们运行项目后添加的页面及配置 仍然能生效 不需要重新启动项目
  //     '/**': { isr: true }
  //   }
  // },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    // '@nuxtjs/style-resources'
  ],

  // 配置页面过渡效果
  pageTransition: {
    name: 'page',
    mode: 'out-in',
    appear: true,
    duration: 300
  },

  // 配置服务端中间件
  serverMiddleware: [
    { path: '/api', handler: '~/server-middleware/api.js' }
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['axios', 'element-ui'], // 第三方库
    transpile: [/^element-ui/],
    // loaders: [
    //   {
    //     test: /\.(png|jpe?g|gif|svg)$/,
    //     loader: "url-loader",
    //     query: {
    //       limit: 10000,
    //       name: "img/[name].[hash].[ext]",
    //     },
    //   },
    // ],
    /*
     ** Run ESLint on save
     */
    // extend(config, { isDev, isClient }) {
    //   if (isDev && isClient) {
    //     config.module.rules.push({
    //       enforce: "pre",
    //       test: /\.(js|vue)$/,
    //       loader: "eslint-loader",
    //       exclude: /(node_modules)/,
    //     });
    //   }
    // },
  },
};

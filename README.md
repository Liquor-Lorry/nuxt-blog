# Lorry-Nuxt 博客系统

一个基于 Nuxt.js 构建的现代化个人博客系统，支持文章发布、评论、分类、标签等功能。

## 项目概述

Lorry-Nuxt 是一个功能完善的个人博客系统，采用 Nuxt.js 框架开发，具有良好的用户体验和丰富的功能特性。系统支持文章的创建、编辑、分类管理，以及评论互动等功能，适合个人博客、技术分享平台等场景使用。

## 功能特点

- **文章管理**：支持 Markdown 编辑器，轻松创建和编辑文章
- **分类与标签**：对文章进行分类整理，支持标签云功能
- **评论系统**：内置评论功能，支持用户互动
- **响应式设计**：适配各种设备屏幕，提供良好的移动端体验
- **文章搜索**：支持全局搜索功能，快速查找内容
- **文件上传**：支持图片上传功能，丰富文章内容
- **数据持久化**：使用 JSON 文件数据库，简单高效

## 技术栈

- **前端框架**：Nuxt.js 2.x (基于 Vue.js)
- **UI 组件库**：Element UI
- **Markdown 编辑器**：Mavon Editor
- **HTTP 请求**：Axios
- **数据存储**：JSON 文件数据库
- **服务端中间件**：Express

## 构建设置

```bash
# 安装依赖
$ npm install

# 开发模式启动，热重载服务运行在 localhost:3500
$ npm run dev

# 构建生产环境并启动服务器
$ npm run build
$ npm run start

# 生成静态项目
$ npm run generate
```

## 项目结构

### `assets`

资源目录包含未编译的样式文件、图片或字体等资源。

更多关于此目录的使用信息，请参考[文档](https://nuxtjs.org/docs/2.x/directory-structure/assets)。

### `components`

组件目录包含 Vue.js 组件。这些组件构成了页面的不同部分，可以在页面、布局甚至其他组件中重用和导入。

更多关于此目录的使用信息，请参考[文档](https://nuxtjs.org/docs/2.x/directory-structure/components)。

### `layouts`

布局目录对于更改 Nuxt 应用的外观和感觉非常有帮助，无论是想要包含侧边栏还是为移动设备和桌面设备提供不同的布局。

更多关于此目录的使用信息，请参考[文档](https://nuxtjs.org/docs/2.x/directory-structure/layouts)。

### `pages`

页面目录包含应用程序的视图和路由。Nuxt 将读取此目录中的所有 `*.vue` 文件并自动设置 Vue Router。

更多关于此目录的使用信息，请参考[文档](https://nuxtjs.org/docs/2.x/get-started/routing)。

### `plugins`

插件目录包含在实例化根 Vue.js 应用程序之前运行的 JavaScript 插件。这是添加 Vue 插件和注入函数或常量的地方。每当需要使用 `Vue.use()` 时，应该在 `plugins/` 中创建一个文件并将其路径添加到插件中。

更多关于此目录的使用信息，请参考[文档](https://nuxtjs.org/docs/2.x/directory-structure/plugins)。

### `static`

静态目录包含静态文件。此目录中的每个文件都映射到 `/`。

示例：`/static/robots.txt` 映射为 `/robots.txt`。

更多关于此目录的使用信息，请参考[文档](https://nuxtjs.org/docs/2.x/directory-structure/static)。

### `store`

Store 目录包含 Vuex 存储文件。在此目录中创建文件会自动激活 Vuex。

更多关于此目录的使用信息，请参考[文档](https://nuxtjs.org/docs/2.x/directory-structure/store)。

### `server-middleware`

服务器中间件目录包含 Express 服务器中间件，用于处理 API 请求和文件上传等功能。

## 自定义配置

项目的主要配置在 `nuxt.config.js` 文件中，包括：

- 全局页面头部设置
- CSS 样式引入
- 插件配置
- Axios 模块配置
- 页面过渡效果
- 服务端中间件
- 构建配置

## 开发指南

1. 添加新文章：使用内置的 Markdown 编辑器创建新文章
2. 自定义样式：在 `assets/css` 目录中修改样式文件
3. 添加新组件：在 `components` 目录中创建新的 Vue 组件
4. 扩展 API：在 `server-middleware/api.js` 中添加新的 API 端点
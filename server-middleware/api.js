const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const app = express();
const router = express.Router();
// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../static/uploads");
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// 创建数据目录和文件
const dataDir = path.resolve(__dirname, "../data");
const dbPath = path.resolve(dataDir, "db.json");
function getDb() {
  const dbPath = require.resolve("../data/db.json");
  delete require.cache[dbPath];
  return require(dbPath);
}
// const db = getDb(); // 移除缓存数据引用

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  console.log("创建数据目录:", dataDir);
  fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 });
}

// 初始化默认数据
const defaultData = {
  articles: [
    {
      id: "1",
      title: "Nuxt.js博客系统搭建",
      content:
        "# 欢迎使用Nuxt.js博客系统\n\n这是一篇示例文章，使用Markdown格式编写。",
      date: "2023-11-01",
      views: 123,
      category: "技术",
      tags: ["Nuxt.js", "Vue"],
      prevId: null,
      nextId: "2",
    },
    {
      id: "2",
      title: "JSON文件数据库使用指南",
      content:
        "# JSON文件数据库\n\n直接使用JSON文件存储数据，适合小型项目和演示环境。",
      date: "2023-11-02",
      views: 98,
      category: "技术",
      tags: ["数据库", "JavaScript"],
      prevId: "1",
      nextId: null,
    },
  ],
  comments: [
    {
      id: "1",
      articleId: "1",
      author: "访客",
      avatar: "/images/avatar.jpg",
      content: "这篇文章很有帮助！",
      date: "2023-11-01 14:30",
      likes: 5,
      replies: [],
    },
  ],
  categories: [
    {
      id: "1",
      name: "技术",
      description: "技术相关文章",
    },
    {
      id: "2",
      name: "生活",
      description: "生活随笔",
    },
  ],
  tags: [
    {
      id: "1",
      name: "Nuxt.js",
      count: 1,
    },
    {
      id: "2",
      name: "Vue",
      count: 1,
    },
    {
      id: "3",
      name: "数据库",
      count: 1,
    },
    {
      id: "4",
      name: "JavaScript",
      count: 1,
    },
  ],
};

// 读取数据库
function readDB() {
  console.log("=== 开始读取数据库 ===");
  console.log("数据库路径:", dbPath);
  console.log("路径是否存在:", fs.existsSync(dbPath));
  if (fs.existsSync(dbPath)) {
    console.log("文件大小:", fs.statSync(dbPath).size);
  }
  if (!fs.existsSync(dbPath)) {
    console.log("数据库文件不存在，创建默认数据...");
    try {
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    } catch (writeError) {
      console.error("创建默认数据库文件失败:", writeError);
      // 返回内存中的默认数据，即使无法写入文件
      return defaultData;
    }
  }
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    const parsedData = JSON.parse(data);
    // 深度验证数据库结构
    if (!parsedData || typeof parsedData !== "object") {
      throw new Error("数据库结构无效，不是有效的JSON对象");
    }
    // 确保所有必要数组存在且为数组类型
    parsedData.articles = Array.isArray(parsedData.articles)
      ? parsedData.articles
      : [];
    parsedData.comments = Array.isArray(parsedData.comments)
      ? parsedData.comments
      : [];
    parsedData.categories = Array.isArray(parsedData.categories)
      ? parsedData.categories
      : [];
    parsedData.tags = Array.isArray(parsedData.tags) ? parsedData.tags : [];

    // 数据迁移：将旧格式的prev/next对象转换为新的ID引用格式
    parsedData.articles.forEach((article) => {
      // 迁移prev引用
      if (
        article.prev &&
        typeof article.prev === "object" &&
        article.prev.id &&
        !article.prevId
      ) {
        article.prevId = article.prev.id;
        delete article.prev;
      }
      // 迁移next引用
      if (
        article.next &&
        typeof article.next === "object" &&
        article.next.id &&
        !article.nextId
      ) {
        article.nextId = article.next.id;
        delete article.next;
      }
    });
    console.log("数据库加载成功，文章数量:", parsedData.articles.length);
    return parsedData;
  } catch (error) {
    console.error("数据库读取或解析错误:", error);
    // 尝试删除损坏的数据库文件
    try {
      if (fs.existsSync(dbPath)) {
        console.log("删除损坏的数据库文件:", dbPath);
        fs.unlinkSync(dbPath);
      }
    } catch (deleteError) {
      console.error("删除损坏数据库文件失败:", deleteError);
    }
    // 创建全新的默认数据库
    try {
      console.log("创建全新的默认数据库...");
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    } catch (writeError) {
      console.error("写入全新默认数据库失败:", writeError);
      // 返回内存中的默认数据作为最后的 fallback
      return JSON.parse(JSON.stringify(defaultData)); // 深拷贝默认数据
    }
  }
}

// 写入数据库
function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    console.log("数据库写入成功");
  } catch (error) {
    console.error("数据库写入错误:", error);
    throw error; // 重新抛出以在路由处理中捕获
  }
}

// 解析JSON请求体
app.use(express.json());

// 保存草稿API
router.post("/articles/draft", (req, res) => {
  try {
    const db = readDB();
    const articleData = req.body;

    // 生成或更新草稿
    if (articleData.id) {
      const index = db.articles.findIndex((a) => a.id === articleData.id);
      if (index !== -1) {
        db.articles[index] = {
          ...db.articles[index],
          ...articleData,
          status: "draft",
        };
      } else {
        return res.status(404).json({ code: "error", message: "文章不存在" });
      }
    } else {
      const newId = Date.now().toString();
      articleData.id = newId;
      articleData.date = new Date().toISOString().split("T")[0];
      articleData.status = "draft";
      articleData.category = "未分类";
      articleData.views = 0;
      db.articles.push(articleData);
    }

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing to database:", err);
        return res
          .status(500)
          .json({ code: "error", message: "Failed to save article" });
      }
      res
        .status(200)
        .json({ code: "success", message: "Article saved successfully" });
    });
  } catch (error) {
    console.error("保存草稿失败:", error);
    res.status(500).json({ code: "error", message: "保存草稿失败" });
  }
});

// 更新文章状态API - 用于发布功能
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router.use(express.json());

// 获取所有分类
router.get("/api/categories", (req, res) => {
  try {
    const db = getDb();
    const categoriesMap = {};

    // 统计每个分类的文章数量
    db.articles.forEach((article) => {
      const categoryName = article.category || "未分类";
      if (!categoriesMap[categoryName]) {
        categoriesMap[categoryName] = {
          categoriesName: categoryName,
          count: 0,
          type: "", // 可以根据需要添加默认类型
        };
      }
      categoriesMap[categoryName].count++;
    });

    // 转换为数组并返回
    const categories = Object.values(categoriesMap);
    res.json({
      code: "success",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      code: "error",
      message: "获取分类失败",
    });
  }
});

// 获取文章列表（带分页和搜索）
router.get("/articles", (req, res) => {
  console.log("进入文章列表路由处理函数");
  console.log("req对象是否存在:", !!req);
  console.log("req.query原始值:", req.query);
  console.log("文章列表API请求已到达服务器");
  try {
    console.log("===== 开始处理文章列表请求 =====");
    console.log("请求参数完整值:", JSON.stringify(req.query, null, 2));
    const data = readDB();
    console.log("数据库读取完成，准备处理文章数据");
    // 实时获取最新数据
    const db = getDb();
    console.log("数据库读取结果:", db);
    console.log("文章列表请求参数:", req.query);
    console.log("处理前的文章数据数量:", db.articles?.length);
    const articles = db.articles || [];
    const query = req.query || {
      search: "",
      category: "",
      sort: "newest",
    };
    const page = Math.max(1, parseInt(query.page) || 1);
    const pageSize = Math.max(1, parseInt(query.pageSize) || 10);
    try {
      const searchQuery = query.search || "";
      const category = query.category || "";
      const sortBy = query.sort || "newest";
      let total = 0; // 初始化total变量为0，避免未定义错误
      // 深拷贝原始数据避免污染
      let filtered = [...articles];

      // 搜索过滤
      if (searchQuery) {
        const lowerSearchQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (article) =>
            (article.title?.toLowerCase() || "").includes(lowerSearchQuery) ||
            (article.summary?.toLowerCase() || "").includes(lowerSearchQuery)
        );
      }

      // 分类过滤
      if (category) {
        filtered = filtered.filter((article) => article.category === category);
      }

      // 排序逻辑
      if (sortBy === "newest") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortBy === "popular") {
        filtered.sort((a, b) => b.views - a.views);
      }

      // 分页处理
      total = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const paginatedArticles = filtered.slice(
        startIndex,
        startIndex + pageSize
      );

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );
      res.json({
        code: "success",
        message: "获取成功",
        data: {
          articles: paginatedArticles.map((item) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            date: item.date,
            views: item.views || 0,
            category: item.category,
            categoryName: item.categoryName,
            tags: item.tags || [],
            cover: item.cover,
          })),
          total,
          page,
          pageSize,
        },
      });
    } catch (processingError) {
      console.error("文章列表处理错误:", processingError);
      console.log("res对象是否存在:", !!res);
      console.log("res.json是否为函数:", typeof res.json === "function");
      // 发生错误时使用原始文章列表
      total = articles.length;
      const startIndex = (page - 1) * pageSize;
      const paginatedArticles = articles.slice(
        startIndex,
        startIndex + pageSize
      );

      res.json({
        code: "error",
        message: "获取文章列表失败",
        data: {
          articles: paginatedArticles,
          total,
          page,
          pageSize,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.log("res对象是否存在:", !!res);
    console.log("res对象类型:", typeof res);
    console.log("res.status类型:", typeof res.status);
    res.statusCode = 500;
    res.json({
      code: "error",
      message: "获取文章列表失败",
      error: error.message,
    });
  }
});

// 创建文章
router.post("/articles", (req, res) => {
  req.body.status = "published";
  const data = readDB();
  const category = data.categories.find(
    (cat) => cat.value === req.body.category
  );
  const categoryName = category ? category.label : "未分类";
  const newArticle = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
    date: new Date().toLocaleDateString(),
    views: 0,
    category: req.body.category,
    categoryName: categoryName,
    tags: req.body.tags || [],
    summary: req.body.summary || "",
    cover: req.body.cover || "",
  };
  data.articles.push(newArticle);
  writeDB(data);
  res.json({
    code: "success",
    message: "文章创建成功",
    data: newArticle,
  });
});

// 更新文章
router.put("/articles/:id", (req, res) => {
  const data = readDB();
  const articleIndex = data.articles.findIndex((a) => a.id === req.params.id);
  if (articleIndex === -1) {
    res.statusCode = 404;
    return res.json({
      code: "error",
      message: "文章不存在",
    });
  }
  data.articles[articleIndex] = {
    ...data.articles[articleIndex],
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags || [],
    summary: req.body.summary || "",
    cover: req.body.cover || "",
  };
  writeDB(data);
  res.json({
    code: "success",
    message: "文章更新成功",
  });
});

// 删除文章
router.delete("/articles/:id", (req, res) => {
  const data = readDB();
  const articleIndex = data.articles.findIndex((a) => a.id === req.params.id);
  if (articleIndex === -1) {
    res.statusCode = 404;
    return res.json({
      code: "error",
      message: "文章不存在",
    });
  }
  data.articles.splice(articleIndex, 1);
  // 同时删除该文章的所有评论
  data.comments = data.comments.filter((c) => c.articleId !== req.params.id);
  writeDB(data);
  res.json({
    code: "success",
    message: "文章删除成功",
  });
});

// 获取文章详情（并增加阅读量）
router.get("/articles/detail/:id", async (req, res) => {
  try {
    const db = readDB();
    const articleId = req.params.id;
    console.log("=== 开始处理文章详情请求 ===");
    console.log("请求的文章ID:", articleId);
    console.log("请求的文章ID:", articleId);
    // 修复ID类型不匹配问题，将ID统一转换为字符串比较
    // 安全访问articles数组，防止undefined错误
    const articles = Array.isArray(db.articles) ? db.articles : [];
    const article = articles.find((a) => String(a.id) === String(articleId));
    console.log(
      "查找到的文章原始数据:",
      article ? `ID: ${article.id}, 标题: ${article.title}` : "未找到文章"
    );
    // 构建安全的导航链接，避免循环引用
    if (article) {
      article.prev = article.prevId
        ? {
            id: article.prevId,
            title:
              article.prevId !== article.id
                ? articles.find((a) => a && a.id === article.prevId)?.title ||
                  "未知文章"
                : "未知文章",
          }
        : null;
      article.next = article.nextId
        ? {
            id: article.nextId,
            title:
              article.nextId !== article.id
                ? articles.find((a) => a && a.id === article.nextId)?.title ||
                  "未知文章"
                : "未知文章",
          }
        : null;
      // 删除ID字段避免重复
      delete article.prevId;
      delete article.nextId;
    }
    console.log("找到的文章数据:", article);
    // 添加服务器端日志确认数据类型
    console.log("Found article:", article);
    console.log(
      "Article type:",
      typeof article,
      Array.isArray(article) ? "Array" : "Object"
    );

    if (!article) {
      res.statusCode = 404;
      return res.json({
        code: "error",
        message: "文章不存在",
        data: null,
      });
    }

    // 增加阅读量
    article.views = (article.views || 0) + 1;
    try {
      writeDB(db);
      console.log("阅读量更新成功");
    } catch (writeError) {
      console.error(
        "阅读量更新失败，将继续返回文章详情但不更新阅读量:",
        writeError
      );
    }

    // 显式构建安全的响应对象，仅包含必要字段
    let safeArticle;
    try {
      console.log("开始构建安全文章对象...");
      safeArticle = {
        id: article.id,
        title: article.title,
        content: article.content,
        date: article.date,
        views: article.views,
        category: article.category,
        categoryName: article.categoryName,
        tags: article.tags,
        summary: article.summary || "",
        cover: article.cover || "",
        prev: article.prev
          ? {
              id: article.prev.id,
              title: article.prev.title,
            }
          : null,
        next: article.next
          ? {
              id: article.next.id,
              title: article.next.title,
            }
          : null,
      };
      console.log("安全文章对象构建成功，属性:", Object.keys(safeArticle));
      console.log(
        "导航链接检查: prev=",
        safeArticle.prev ? safeArticle.prev.id : "null",
        "next=",
        safeArticle.next ? safeArticle.next.id : "null"
      );
    } catch (constructionError) {
      console.error("构建安全文章对象失败:", constructionError);
      throw new Error(`构建文章响应对象时出错: ${constructionError.message}`);
    }

    try {
      res.json({
        code: "success",
        message: "获取文章详情成功",
        data: safeArticle,
      });
    } catch (jsonError) {
      console.error("JSON序列化失败: ", jsonError);
      try {
        console.error(
          "序列化失败的文章数据: ",
          JSON.stringify(safeArticle, null, 2)
        );
      } catch (logError) {
        console.error("记录失败的文章数据时出错: ", logError);
        console.error("安全文章对象可能包含循环引用或不可序列化数据");
      }
      res.statusCode = 500;
      res.json({
        code: "error",
        message: "文章数据序列化失败",
        error: jsonError.message,
        data: null,
      });
    }
  } catch (error) {
    console.error("获取文章详情失败:", error);
    res.statusCode = 500;
    res.json({
      code: "error",
      message: "服务器错误，获取文章详情失败",
      error: error.message,
      data: null,
    });
  }
});

// 获取文章评论
router.get("/comments/article/:articleId", (req, res) => {
  const data = readDB();
  const comments = data.comments.filter(
    (c) => c.articleId === req.params.articleId
  );
  res.json({
    code: "success",
    data: { comments },
  });
});

// 回复评论
router.post("/comments/reply", (req, res) => {
  console.log("-------------------------------------------------------------");
  try {
    const db = readDB();
    const { targetId, parentReplyId, content, author, avatar } = req.body;

    // 递归查找评论并添加回复
    const searchId = parentReplyId || targetId;
    const findCommentAndAddReply = (comments) => {
      for (let comment of comments) {
        if (comment.id === searchId) {
          const newReply = {
            id: Date.now().toString(),
            author: author || "访客",
            avatar:
              avatar ||
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            content: content,
            date: new Date().toLocaleString(),
            likes: 0,
            replies: [],
          };
          comment.replies = comment.replies || [];
          comment.replies.push(newReply);
          return true;
        }
        if (comment.replies && comment.replies.length > 0) {
          if (findCommentAndAddReply(comment.replies)) {
            return true;
          }
        }
      }
      return false;
    };

    const commentAdded = findCommentAndAddReply(db.comments);
    if (!commentAdded) {
      return res.status(404).json({
        code: "error",
        message: "未找到目标评论",
      });
    }

    writeDB(db);
    res.json({
      code: "success",
      message: "回复成功",
      data: {},
    });
  } catch (error) {
    console.error("回复评论错误:", error);
    res.status(500).json({
      code: "error",
      message: "回复失败: " + error.message,
    });
  }
});

// 创建评论
router.post("/comments", (req, res) => {
  const data = readDB();
  const newComment = {
    id: Date.now().toString(),
    articleId: req.body.articleId,
    author: req.body.author || "访客",
    avatar:
      req.body.avatar ||
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    content: req.body.content,
    date: new Date().toLocaleString(),
    likes: 0,
    replies: [],
  };
  data.comments.push(newComment);
  writeDB(data);
  res.json({
    code: "success",
    message: "评论创建成功",
    data: newComment,
  });
});

// 获取所有标签
router.get("/tags", (req, res) => {
  const data = readDB();
  const tags = data.tags || [];
  res.json({
    code: "success",
    data: tags,
  });
});

// 创建标签
router.post("/tags", (req, res) => {
  const data = readDB();
  const newTag = {
    id: Date.now().toString(),
    name: req.body.name,
    count: 0,
  };
  data.tags.push(newTag);
  writeDB(data);
  res.json({
    code: "success",
    message: "标签创建成功",
    data: newTag,
  });
});

// 更新标签
router.put("/tags/:id", (req, res) => {
  const data = readDB();
  const tagIndex = data.tags.findIndex((t) => t.id === req.params.id);
  if (tagIndex === -1) {
    res.statusCode = 404;
    return res.json({
      code: "error",
      message: "标签不存在",
    });
  }
  data.tags[tagIndex].name = req.body.name;
  writeDB(data);
  res.json({
    code: "success",
    message: "标签更新成功",
  });
});

// 删除标签
router.delete("/tags/:id", (req, res) => {
  const data = readDB();
  const tagIndex = data.tags.findIndex((t) => t.id === req.params.id);
  if (tagIndex === -1) {
    res.statusCode = 404;
    return res.json({
      code: "error",
      message: "标签不存在",
    });
  }
  // 从所有文章中移除该标签
  data.articles.forEach((article) => {
    article.tags = article.tags.filter(
      (tagName) => tagName !== data.tags[tagIndex].name
    );
  });
  data.tags.splice(tagIndex, 1);
  writeDB(data);
  res.json({
    code: "success",
    message: "标签删除成功",
  });
});

// 获取分类列表（带文章数量统计）
router.get("/categories", (req, res) => {
  try {
    const data = readDB();
    const articles = data.articles || [];
    const categories = data.categories || [];

    // 分类名称映射表
    const categoryMap = {
      frontend: {
        id: "1",
        value: "frontend",
        label: "前端开发",
        type: "success",
      },
      backend: { id: "2", value: "backend", label: "后端技术", type: "danger" },
      life: { id: "3", value: "life", label: "生活随笔", type: "primary" },
      tools: { id: "4", value: "tools", label: "工具使用", type: "warning" },
      experience: {
        id: "5",
        value: "experience",
        label: "心得体会",
        type: "primary",
      },
      others: { id: "6", value: "others", label: "其他", type: "info" },
    };

    // 统计每个分类的文章数量
    const categoryCounts = {};
    articles.forEach((article) => {
      const category = article.category || "";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // 转换分类格式并添加数量
    const formattedCategories = categories.map((category) => {
      const mappedCategory = categoryMap[category.value] || {
        value: category.value.toLowerCase().replace(/\s+/g, "-"),
        label: category.label,
        type: category.type,
      };
      return {
        ...mappedCategory,
        count: categoryCounts[category.value] || 0,
      };
    });

    res.json({
      code: "success",
      data: formattedCategories,
    });
  } catch (error) {
    console.error("获取分类列表失败:", error);
    res.status(500).json({
      code: "error",
      message: "获取分类列表失败",
    });
  }
});

// 创建分类
router.post("/categories", (req, res) => {
  const data = readDB();
  const newCategory = {
    id: Date.now().toString(),
    name: req.body.name,
    description: req.body.description || "",
  };
  if (!data.categories) data.categories = [];
  data.categories.push(newCategory);
  writeDB(data);
  res.json({
    code: "success",
    message: "分类创建成功",
    data: newCategory,
  });
});

// 更新分类
router.put("/categories/:id", (req, res) => {
  const data = readDB();
  const categoryIndex = data.categories.findIndex(
    (c) => c.id === req.params.id
  );
  if (categoryIndex === -1) {
    res.statusCode = 404;
    return res.json({
      code: "error",
      message: "分类不存在",
    });
  }
  data.categories[categoryIndex] = {
    ...data.categories[categoryIndex],
    name: req.body.name,
    description: req.body.description,
  };
  writeDB(data);
  res.json({
    code: "success",
    message: "分类更新成功",
  });
});

// 删除分类
router.delete("/categories/:id", (req, res) => {
  const data = readDB();
  const categoryIndex = data.categories.findIndex(
    (c) => c.id === req.params.id
  );
  if (categoryIndex === -1) {
    res.statusCode = 404;
    return res.json({
      code: "error",
      message: "分类不存在",
    });
  }
  data.categories.splice(categoryIndex, 1);
  writeDB(data);
  res.json({
    code: "success",
    message: "分类删除成功",
  });
});

// 文件上传
router.post("/upload", upload.single("file"), (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.json({
    code: "success",
    data: {
      url: fullUrl,
    },
  });
});

// 评论点赞
const findComment = (comments, targetId) => {
  for (const comment of comments) {
    if (comment.id === targetId) return comment;
    if (comment.replies?.length) {
      const found = findComment(comment.replies, targetId);
      if (found) return found;
    }
  }
};

router.post("/comments/:id/like", (req, res) => {
  try {
    const db = readDB();
    const target = findComment(db.comments, req.params.id);

    if (!target) {
      return res.status(404).json({ message: "评论/回复不存在" });
    }

    target.likes = (target.likes || 0) + 1;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({ success: true, likes: target.likes });
  } catch (error) {
    res.status(500).json({ message: "点赞失败", error: error.message });
  }
});

// 回复评论
router.post("/comments/reply", (req, res) => {
  try {
    const db = readDB();
    const { targetId, targetType, content } = req.body;

    if (!targetId || !content) {
      return res.status(400).json({ message: "目标ID和回复内容不能为空" });
    }

    // 生成唯一ID
    const replyId = Date.now().toString();
    const newReply = {
      id: replyId,
      author: "访客",
      avatar: "/images/avatar.jpg",
      content: content,
      date: new Date().toLocaleString(),
      likes: 0,
      replies: [],
    };

    // 查找目标评论并添加回复
    const addReply = (comments) => {
      for (let i = 0; i < comments.length; i++) {
        // 如果是顶级评论
        if (comments[i].id === targetId && targetType === "comment") {
          comments[i].replies = comments[i].replies || [];
          comments[i].replies.push(newReply);
          return true;
        }

        // 如果是回复的回复
        if (comments[i].replies && comments[i].replies.length) {
          const found = addReply(comments[i].replies);
          if (found) return true;
        }
      }
      return false;
    };

    const replyAdded = addReply(db.comments);

    if (!replyAdded) {
      return res.status(404).json({ message: "目标评论不存在" });
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({ success: true, data: { reply: newReply } });
  } catch (error) {
    res.status(500).json({ message: "回复失败", error: error.message });
  }
});

// 错误处理中间件
router.use((err, req, res, next) => {
  debugger;
  console.error(
    "API Error:",
    new Date().toISOString(),
    "URL:",
    req.url,
    "Error:",
    err
  );
  res.statusCode = err.statusCode || 500;
  res.json({
    code: "error",
    message: err.message || "服务器内部错误",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});
app.use(router);
module.exports = app;

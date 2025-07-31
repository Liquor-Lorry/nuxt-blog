<template>
  <div class="editor-container">
    <div class="editor-header">
      <el-input
        v-model="article.title"
        placeholder="请输入文章标题"
        class="title-input"
        maxlength="100"
        show-word-limit
      >
      </el-input>

      <div class="header-actions">
        <el-button @click="saveDraft" plain>保存草稿</el-button>
        <el-button type="primary" @click="showPublishDialog">{{
          id ? "更新文章" : "发布文章"
        }}</el-button>
      </div>
    </div>

    <div class="editor-main">
      <div class="editor-wrapper">
        <mavon-editor
          v-model="article.content"
          :toolbars="editorToolbars"
          @save="saveDraft"
          @imgAdd="handleImgAdd"
          placeholder="开始创作..."
          :style="{ height: editorHeight }"
        />
      </div>
    </div>

    <!-- 发布对话框 -->
    <el-dialog
      :title="id ? '更新文章' : '发布文章'"
      :visible.sync="publishDialogVisible"
      width="600px"
      custom-class="custom-publish-dialog"
      append-to-body="false"
    >
      <div class="publish-form">
        <el-form :model="article" label-width="80px">
          <el-form-item label="分类">
            <el-select v-model="article.category" placeholder="选择分类">
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标签">
            <el-tag
              :key="tag"
              v-for="tag in article.tags"
              closable
              :disable-transitions="false"
              @close="handleTagClose(tag)"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputTagVisible"
              v-model="inputTagValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
            >
              + 新标签
            </el-button>
          </el-form-item>

          <el-form-item label="摘要">
            <el-input
              type="textarea"
              v-model="article.summary"
              :rows="3"
              placeholder="请输入文章摘要"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="封面">
            <el-upload
              class="cover-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload"
            >
              <img
                v-if="article.cover"
                :src="article.cover"
                class="cover-image"
              />
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publishDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="publishArticle">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import articleApi from "@/api/article";

export default {
  name: "Editor",
  data() {
    return {
      article: {
        title: "",
        content: "",
        category: "",
        tags: [],
        summary: "",
        cover: "",
      },
      editorToolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        fullscreen: true,
        readmodel: true,
        help: true,
        undo: true,
        redo: true,
        navigation: true,
        alignleft: true,
        aligncenter: true,
        alignright: true,
        subfield: true,
        preview: true,
      },
      publishDialogVisible: false,
      categories: [],
      loadingCategories: false,
      inputTagVisible: false,
      inputTagValue: "",
      editorHeight: "600px",
      loading: false,
      id: "",
    };
  },
  async created() {
    // 获取路由参数中的文章 id
    const id = this.$route.params.id;
    this.id = id;
    if (id) {
      await this.fetchArticle(id);
    }
    this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      this.loadingCategories = true;
      try {
        const res = await articleApi.getCategories();
        this.categories = res.data.data || [];
      } catch (error) {
        console.error("获取分类失败:", error);
        this.$message.error("获取分类失败");
      } finally {
        this.loadingCategories = false;
      }
    },
    async fetchArticle(id) {
      try {
        this.loading = true;
        const res = await articleApi.getArticleDetail(id);
        if (res.data.code === "success") {
          this.article = res.data.data;
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "获取文章详情失败";
        console.error("获取文章详情失败:", errorMsg);
        this.$message.error(errorMsg);
      } finally {
        this.loading = false;
      }
    },
    async saveDraft() {
      try {
        this.loading = true;
        const result = await articleApi.saveDraft(this.article);
        if (result.data.code === "success") {
          this.article.id = result.data.data.id;
          this.$message.success("草稿保存成功");
          this.$router.push("/articles");
        } else {
          this.$message.error(
            "草稿保存失败: " + (result.data.message || "未知错误")
          );
        }
      } catch (error) {
        console.error("保存草稿失败:", error);
        this.$message.error("草稿保存失败，请重试");
      } finally {
        this.loading = false;
      }
    },
    showPublishDialog() {
      this.publishDialogVisible = true;
    },
    async publishArticle() {
      try {
        const id = this.$route.params.id;
        this.article.status = "published";
        let res;

        if (id) {
          // 更新文章
          res = await articleApi.updateArticle(id, this.article);
        } else {
          // 发布新文章
          res = await articleApi.createArticle(this.article);
        }

        if (res.data.code === "success") {
          this.$message.success(id ? "更新成功" : "发布成功");
          this.$router.push("/articles");
        }
      } catch (error) {
        console.error(id ? "更新文章失败:" : "发布文章失败:", error);
        this.$message.error(id ? "更新文章失败" : "发布文章失败");
      }
    },
    async handleImgAdd(pos, file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await this.$axios.post("/api/upload", formData);
        if (res.data.code === 200) {
          const url = res.data.data.url;
          this.$refs.md.$img2Url(pos, url);
        }
      } catch (error) {
        console.error("图片上传失败:", error);
        this.$message.error("图片上传失败");
      }
    },
    handleTagClose(tag) {
      this.article.tags.splice(this.article.tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputTagVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputTagValue) {
        this.article.tags.push(this.inputTagValue);
      }
      this.inputTagVisible = false;
      this.inputTagValue = "";
    },
    handleCoverSuccess(res, file) {
      this.article.cover = res.data.url;
    },
    beforeCoverUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传封面图片只能是图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
      return isImage && isLt2M;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;

  .editor-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    gap: 20px;

    .title-input {
      flex: 1;
      max-width: 600px;

      :deep(.el-input__inner) {
        font-size: 18px;
        padding: 10px 15px;
      }
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .editor-main {
    flex: 1;
    overflow: hidden;

    .editor-wrapper {
      height: 100%;

      :deep(.v-note-wrapper) {
        height: 100% !important;
      }
    }
  }
}

.publish-form {
  .tag-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .button-new-tag {
    margin-bottom: 10px;
  }

  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: baseline;
  }

  .cover-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409eff;
      }
    }

    .cover-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .cover-image {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
::v-deep .custom-publish-dialog {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .el-dialog__header {
    padding: 20px 25px;
    border-bottom: 1px solid #f5f5f5;
  }

  .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #1d2129;
  }

  .el-dialog__body {
    padding: 25px;
  }

  .el-dialog__footer {
    padding: 15px 25px;
    border-top: 1px solid #f5f5f5;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px;
    border-top: 1px solid #f0f0f0;

    .el-button {
      padding: 8px 20px;
      border-radius: 6px;
    }

    .el-button--primary {
      background: #409eff;
      border-color: #409eff;
    }
  }
}
</style>

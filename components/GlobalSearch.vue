<template>
  <div class="global-search">
    <el-tooltip content="搜索文章 (Ctrl + K)" placement="bottom">
      <el-button type="text" class="search-trigger" @click="showDialog">
        <i class="el-icon-search"></i>
      </el-button>
    </el-tooltip>

    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :modal-append-to-body="true"
      :lock-scroll="false"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="true"
      width="650px"
      custom-class="search-dialog"
      @closed="handleDialogClosed"
    >
      <template #title>
        <div class="dialog-title">
          <i class="el-icon-search"></i>
          <span>搜索文章</span>
        </div>
      </template>
      <div class="search-content" @click.stop>
        <el-input
          ref="searchInput"
          v-model="searchQuery"
          placeholder="输入关键词搜索文章..."
          prefix-icon="el-icon-search"
          clearable
          @input="handleSearch"
          @keydown.esc.native="closeDialog"
          @keydown.enter.native="handleEnter"
          @keydown.down.prevent="navigateResults(1)"
          @keydown.up.prevent="navigateResults(-1)"
        >
          <template #suffix>
            <span class="keyboard-shortcut">ESC关闭</span>
          </template>
        </el-input>

        <div class="search-results-container">
          <transition name="fade">
            <div
              class="search-results-wrapper"
              v-if="searchQuery"
              v-loading="loading"
              element-loading-text="搜索中..."
            >
              <div
                class="search-results"
                v-if="searchResults.length && !loading"
                ref="resultsList"
              >
                <div
                  v-for="(result, index) in searchResults"
                  :key="result.id"
                  :class="['result-item', { active: currentIndex === index }]"
                  @click="handleResultClick(result)"
                  @mouseover="currentIndex = index"
                >
                  <div class="result-content">
                    <h4>
                      <i class="el-icon-document"></i>
                      <span v-html="highlightText(result.title)"></span>
                    </h4>
                    <p
                      class="summary"
                      v-html="highlightText(result.summary)"
                    ></p>
                    <div class="result-meta">
                      <span
                        ><i class="el-icon-date"></i> {{ result.date }}</span
                      >
                      <span
                        ><i class="el-icon-collection-tag"></i>
                        {{ getCategoryName(result.category) }}</span
                      >
                      <span
                        ><i class="el-icon-view"></i>
                        {{ result.views || 0 }}次阅读</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="!loading && searchQuery" class="no-results">
                <i class="el-icon-warning-outline"></i>
                <p>未找到相关文章</p>
              </div>
            </div>
            <div v-else class="search-placeholder">
              <div class="placeholder-content">
                <i class="el-icon-search"></i>
                <p>输入关键词开始搜索</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import articleApi from "@/api/article";

export default {
  name: "GlobalSearch",
  data() {
    return {
      dialogVisible: false,
      searchQuery: "",
      searchResults: [],
      loading: false,
      currentIndex: -1,
      categories: [],
      loadingCategories: false
    };
  },
  methods: {
    async fetchCategories() {
      this.loadingCategories = true;
      try {
        const res = await articleApi.getCategories();
        this.categories = res.data.data || [];
      } catch (error) {
        console.error('获取分类失败:', error);
      } finally {
        this.loadingCategories = false;
      }
    },
    getCategoryName(categoryId) {
      return this.categories.find(item => item.value === categoryId)?.label;
    },
    showDialog() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    closeDialog() {
      this.dialogVisible = false;
      this.searchQuery = "";
      this.searchResults = [];
      this.currentIndex = -1;
    },
    handleSearch: debounce(async function () {
      if (!this.searchQuery) {
        this.searchResults = [];
        return;
      }

      this.loading = true;
      try {
        const res = await articleApi.getArticles({ search: this.searchQuery });
        if (res.data.code === "success") {
          this.searchResults = res.data.data.articles || [];
        } else {
          this.searchResults = [];
        }
      } catch (error) {
        this.searchResults = [];
        console.error("搜索失败:", error);
      } finally {
        this.loading = false;
      }
    }, 300),
    handleResultClick(result) {
      this.closeDialog();
      this.$router.push(`/article/detail/${result.id}`);
    },
    handleEnter() {
      if (this.currentIndex >= 0 && this.searchResults[this.currentIndex]) {
        this.handleResultClick(this.searchResults[this.currentIndex]);
      }
    },
    highlightText(text) {
      if (!this.searchQuery) return text;
      const reg = new RegExp(this.searchQuery, "gi");
      return text.replace(
        reg,
        (match) => `<span class="highlight">${match}</span>`
      );
    },
    navigateResults(direction) {
      const maxIndex = this.searchResults.length - 1;
      if (maxIndex < 0) return;

      if (this.currentIndex === -1) {
        this.currentIndex = direction > 0 ? 0 : maxIndex;
      } else {
        this.currentIndex =
          (this.currentIndex + direction + this.searchResults.length) %
          this.searchResults.length;
      }

      this.$nextTick(() => {
        const activeItem = this.$refs.resultsList.children[this.currentIndex];
        if (activeItem) {
          activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      });
    },
    handleDialogClosed() {
      this.searchQuery = "";
      this.searchResults = [];
      this.currentIndex = -1;
      this.loading = false;
    },
  },
  created() {
    this.fetchCategories();
  },
  mounted() {
    // 添加快捷键支持
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        this.showDialog();
      }
    });
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<style lang="scss" scoped>
.global-search {
  .search-trigger {
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 32px;
    font-size: 18px;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

:deep(.search-dialog) {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 15vh;
  transform: translateZ(0);

  .el-dialog__header {
    margin: 0;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    position: relative;
    z-index: 1;

    .dialog-title {
      display: flex;
      align-items: center;
      font-size: 16px;

      i {
        margin-right: 8px;
        font-size: 18px;
      }
    }
  }

  .el-dialog__body {
    padding: 20px;
    position: relative;
    z-index: 1;
    max-height: 70vh;
    overflow: hidden;
  }

  .search-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-input {
      flex-shrink: 0;
    }

    .search-results-container {
      flex: 1;
      margin-top: 20px;
      position: relative;
      overflow: hidden;

      .search-results-wrapper,
      .search-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .search-results-wrapper {
        position: relative;
        min-height: 200px;
      }

      .search-results {
        max-height: calc(70vh - 140px);
        overflow-y: auto;
        border-radius: 4px;
        padding: 4px;

        &::-webkit-scrollbar {
          width: 4px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }

        .result-item {
          padding: 16px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.25s ease;
          margin-bottom: 12px;
          border: 1px solid #e4e7ed;
          background-color: #fff;
          box-shadow: 0 1px 3px rgba(64, 158, 255, 0.05);

          &:last-child {
            margin-bottom: 0;
          }

          &:hover,
          &.active {
            border-color: #409eff;
            background-color: #ecf5ff;
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(64, 158, 255, 0.15);
          }

          .result-content {
            h4 {
              margin: 0 0 12px;
              color: #333;
              font-size: 16px;
              font-weight: 600;
              display: flex;
              align-items: center;
              line-height: 1.4;

              i {
                margin-right: 8px;
                font-size: 18px;
                color: #409eff;
              }

              :deep(.highlight) {
                color: var(--el-color-danger);
                font-weight: bold;
                padding: 0 2px;
              }
            }

            .summary {
              margin: 0 0 12px;
              font-size: 14px;
              color: #666;
              line-height: 1.6;

              :deep(.highlight) {
                background: rgba(255, 208, 75, 0.3);
                padding: 0 2px;
                border-radius: 2px;
              }
            }

            .result-meta {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              gap: 16px;
              font-size: 13px;
              color: #999;

              span {
                display: flex;
                align-items: center;

                i {
                  margin-right: 4px;
                }
              }
            }
          }
        }
      }

      .no-results,
      .search-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: #909399;

        i {
          font-size: 32px;
          margin-bottom: 10px;
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 768px) {
  :deep(.search-dialog) {
    width: 90% !important;
    margin: 10vh auto 0;

    .el-dialog__body {
      max-height: 80vh;
      padding: 15px;
    }

    .search-content {
      .search-results-container {
        .search-results {
          .result-item {
            padding: 12px;

            .result-content {
              .result-meta {
                gap: 8px;
                flex-direction: column;
                align-items: flex-start;
              }
            }
          }
        }
      }
    }
  }
}

:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.9);

  .el-loading-spinner {
    .el-loading-text {
      color: #909399;
      font-size: 14px;
      margin-top: 10px;
    }
  }
}
</style>

<template>
  <div class="comment-list">
    <div
      v-for="comment in localComments"
      :key="`${comment.id}-${depth}`"
      class="comment-item"
    >
      <div class="comment-header">
        <el-avatar :size="30" :src="comment.avatar"></el-avatar>
        <div class="comment-meta">
          <h4>{{ comment.author }}</h4>
          <span>{{ comment.date }}</span>
        </div>
      </div>
      <div class="comment-content">{{ comment.content }}</div>
      <div class="comment-actions">
        <el-button type="text" size="small" @click="toReply(comment)">
          回复
        </el-button>
        <el-button class="like-btn" type="text" size="small" @click="like(comment)">
          <i class="el-icon-star-off"></i> {{ comment.likes }}
        </el-button>
      </div>

      <!-- 回复表单 -->
      <div
        v-if="
          replyTo &&
          comment &&
          replyTo.id === comment.id &&
          replyTo.type === 'comment'
        "
        class="reply-form"
      >
        <el-input
          v-model="replyContent"
          placeholder="写下你的回复..."
          type="textarea"
          :rows="2"
          class="reply-input"
          ref="replyInput"
        ></el-input>
        <div class="reply-form-actions">
          <el-button
            type="text"
            size="small"
            @click="cancelReply"
            style="color: #999"
            >取消</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="submitReply"
            :loading="submittingReply"
          >
            回复
          </el-button>
        </div>
      </div>
      <div
        class="comment-replies"
        v-if="comment.replies && comment.replies.length > 0"
      >
        <div
          v-for="(reply, replyIndex) in comment.replies"
          :key="`${reply?.id}-${replyIndex}-${depth}`"
          class="reply-item"
          :style="{ marginLeft: `${depth * 30}px`, position: 'relative' }"
        >
          <!-- 连接线：仅在嵌套回复有子回复时显示 -->
          <div
            class="reply-connector"
            :style="{ left: `${15 + depth * 30}px`, top: '15px', height: 'calc(100% - 30px)' }"
            v-if="depth > 0 && reply.replies && reply.replies.length > 1"
          ></div>
          <template>
            <!-- 回复项模板结构 -->
            <div class="reply-item">
              <div class="reply-header">
                <el-avatar :size="30" :src="reply.avatar"></el-avatar>
                <div class="comment-meta">
                  <h4>{{ reply.author }}</h4>
                  <span>{{ reply.date }}</span>
                </div>
              </div>
              <div class="reply-content">
                <span>{{ reply.content }}</span>
                <div class="comment-actions">
                  <el-button
                    type="text"
                    size="small"
                    @click="toReply(comment, reply)"
                    >回复</el-button
                  >
                  <el-button class="like-btn" type="text" size="small" @click="like(reply)">
                    <i class="el-icon-star-off"></i> {{ reply.likes }}
                  </el-button>
                </div>
                <!-- 嵌套回复表单 -->
                <div
                  v-if="
                    replyTo && replyTo.id === reply.id && replyTo.type === 'reply'
                  "
                  class="nested-reply-form"
                >
                  <el-input
                    v-model="replyContent"
                    :placeholder="`回复 @${replyTo.author}...`"
                    type="textarea"
                    :rows="2"
                    class="reply-input"
                    ref="replyInput"
                  ></el-input>
                  <div class="reply-form-actions">
                    <el-button
                      type="text"
                      size="small"
                      @click="cancelReply"
                      style="color: #999"
                      >取消</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      @click="submitReply"
                      :loading="submittingReply"
                    >
                      回复
                    </el-button>
                  </div>
                </div>
                <!-- 递归渲染嵌套回复 -->
                <div v-if="reply.replies && reply.replies.length > 0">
                  <comment-list
                    :comments="reply.replies"
                    :depth="depth + 1"
                    :articleId="articleId"
                  ></comment-list>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="loading"
      class="loading-comments"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
    >
      <p>加载评论中...</p>
    </div>
    <div
      v-if="!hasAnyComments && depth === 0"
      class="no-comments"
    >
      <p>暂无评论，快来发表第一条评论吧~</p>
    </div>
  </div>
</template>

<script>
import commentApi from "@/api/comment";

export default {
  computed: {
    hasAnyComments() {
      const checkComments = (comments) => {
            if (!comments || comments.length === 0) return false;
            return true;
          };
      return checkComments(this.depth === 0 ? this.localComments : this.comments);
    }
  },

  name: "CommentList",
  props: {
    depth: {
      type: Number,
      default: 0,
    },
    articleId: {
      type: [String, Number],
      required: true,
    },
    comments: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localComments: [],
      loading: false,
      replyTo: null, // 存储当前回复目标 { id: '', type: 'comment|reply', author: '' }
      replyContent: "",
      submittingReply: false,
    };
  },
  watch: {
    comments: {
      immediate: true,
      deep: true,
      handler(newVal) {
        // 只有子组件才响应comments prop变化
        if (this.depth > 0) {
          this.localComments = newVal ? [...newVal] : [];
        }
      },
    },
  },
  mounted() {
    // 仅顶层评论组件加载数据，避免递归组件重复请求
    if (this.depth === 0) {
      this.fetchComments();
    }
  },
  methods: {
    // 移除强制深度处理，使用API原始数据
    async fetchComments() {
      this.loading = true;
      try {
        const { data } = await commentApi.getCommentsByArticle(this.articleId);
        // 直接使用API返回的评论数据，不做额外层级处理
        // 规范化评论数据，确保replies数组存在
        this.localComments = (data.data.comments || []).map((comment) => ({
          ...comment,
          replies: comment.replies || [],
        }));
      } catch (error) {
        this.$message.error("加载评论失败，请重试");
      } finally {
        this.loading = false;
      }
    },
    toReply(targetComment, parentReply = null) {
      // 区分评论和回复类型
      const isReply = !!parentReply;
      const targetType = isReply ? "reply" : "comment";
      const targetId = isReply ? parentReply.id : targetComment.id;
      const rootId = targetComment.id; // 始终保留顶级评论ID

      this.replyTo = {
        id: targetId,
        rootId: rootId,
        type: targetType,
        author: isReply ? parentReply.author : targetComment.author,
        parentId: isReply ? parentReply.id : null,
      };
      this.replyContent = "";
      this.$nextTick(() => {
        const input = this.$refs.replyInput;
        if (input && input[0]) input[0].focus();
      });
    },
    cancelReply() {
      this.replyTo = null;
      this.replyContent = "";
    },
    async submitReply() {
      if (!this.replyContent.trim()) {
        this.$message.warning("回复内容不能为空");
        return;
      }

      this.submittingReply = true;
      // 调试日志：打印回复参数
      console.log("提交回复参数:", {
        parentReplyId: this.replyTo.parentId,
        targetId: this.replyTo.rootId,
        content: this.replyContent,
        articleId: this.articleId,
      });
      try {
        const payload = {
          parentReplyId: this.replyTo.parentId,
          targetId: this.replyTo.rootId,
          content: this.replyContent,
          articleId: this.articleId,
        };

        const { data } = await commentApi.replyToComment(payload);
        // 查找目标评论并添加新回复
        const addReplyToComments = (comments = this.localComments) => {
          for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === this.replyTo.id) {
              comments[i].replies = comments[i].replies || [];
              comments[i].replies.push(data.data.reply);
              return true;
            }

            if (comments[i].replies && comments[i].replies.length) {
              const found = addReplyToComments(comments[i].replies);
              if (found) return true;
            }
          }
          return false;
        };

        addReplyToComments(this.comments);
        this.cancelReply();
        this.$message.success("回复成功");
        this.fetchComments();
      } catch (error) {
        this.$message.error("回复失败，请重试");
      } finally {
        this.submittingReply = false;
      }
    },
    async like(comment) {
      try {
        await commentApi.likeComment(comment.id);
        comment.likes++;
      } catch (error) {
        this.$message.error("点赞失败，请重试");
      }
    },
  },
  ref: "commentList",
};
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-item, .reply-item {
    padding: 8px 15px;
    background: #fff;
    border-radius: 8px;
    // box-shadow: 0 2px 8px rgba(0,0,0,0.05);

    .comment-header, .reply-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .el-avatar {
        margin-right: 12px;
      }

      .comment-meta, .reply-meta {
        h4 {
          margin: 0 0 4px;
          font-size: 14px;
          color: #333;
        }
        span {
          color: #999;
          font-size: 12px;
        }
      }
    }

    .comment-content, .reply-content span {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 12px;
      margin-left: 8px;
      display: block;
    }

    .comment-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
  
      .el-button {
        // color: #666;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 12px;
        transition: all 0.2s;
  
        &.like-btn {
          color: #f7c217;
          i {
            color: inherit;
          }
        }
      }
  
      // 嵌套回复按钮样式
      .reply-content & {
        .el-button {
          font-size: 12px;
          // color: #666;
          padding: 1px 6px;
        }
      }
    }
  }

  .reply-item {
    background: #fff;
    box-shadow: none;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: -20px;
      top: 24px;
      width: 16px;
      height: 1px;
      background: #eee;
    }
  }
}

.loading-comments {
    text-align: center;
    padding: 20px;
    color: #666;
  }

  .no-comments {
    text-align: center;
    padding: 30px;
    color: #999;
    background: #f9f9f9;
    border-radius: 4px;
  }
</style>

<style lang="scss" scoped>
.reply-item {
  .comment-meta {
    h4 {
      font-size: 13px !important;
      margin-right: 8px;
    }
    span {
      font-size: 12px;
      color: #999;
    }
  }

  .reply-content span {
    font-size: 13px !important;
    line-height: 1.5;
    margin: 8px 0;
  }

  &:before {
    top: 18px !important;
  }
}
</style>

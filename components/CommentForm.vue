<template>
  <div class="comment-form">
    <el-form :model="commentForm" ref="commentForm" :rules="rules">
      <el-form-item prop="content">
        <el-input
          type="textarea"
          v-model="commentForm.content"
          :rows="4"
          placeholder="请输入评论内容..."
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitComment"
          :loading="loading"
          class="submit-btn"
        >
          提交评论
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import commentApi from '@/api/comment'

export default {
  name: 'CommentForm',
  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      commentForm: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          { min: 5, message: '评论内容至少5个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async submitComment() {
      this.$refs.commentForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            await commentApi.createComment({
              articleId: this.articleId,
              content: this.commentForm.content
            })
            this.$message.success('评论成功')
            this.commentForm.content = ''
            this.$emit('comment-added')
          } catch (error) {
            this.$message.error('评论失败，请重试')
            console.error('Failed to submit comment:', error)
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-form {
  margin-top: 20px;

  .el-textarea {
    width: 100%;
    margin-bottom: 15px;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>
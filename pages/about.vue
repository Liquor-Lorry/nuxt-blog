<template>
  <div class="about-container">
    <!-- 个人信息卡片 -->
    <el-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-wrapper">
          <el-avatar
            :size="120"
            :src="require('@/assets/images/avatar.jpg')"
          ></el-avatar>
        </div>
        <h1 class="name">Lorry</h1>
        <p class="title">前端开发工程师</p>
        <div class="social-links">
          <a href="https://github.com" target="_blank" title="GitHub">
            <i class="el-icon-position"></i>
          </a>
          <a href="mailto:example@email.com" title="Email">
            <i class="el-icon-message"></i>
          </a>
          <a href="https://twitter.com" target="_blank" title="Twitter">
            <i class="el-icon-share"></i>
          </a>
        </div>
      </div>

      <el-divider></el-divider>

      <div class="profile-content">
        <div class="section">
          <h2 class="section-title">
            <i class="el-icon-user"></i>
            关于我
          </h2>
          <p class="description">
            热爱编程、热爱技术的前端开发者。专注于Vue.js技术栈，
            对用户体验和代码质量有着较高的追求。喜欢分享技术，热衷于学习新技术。
          </p>
        </div>

        <div class="section skills-section">
          <h2 class="section-title">
            <i class="el-icon-medal"></i>
            技能特长
          </h2>
          <div class="skills">
            <!-- 主要技能 -->
            <div class="skill-category main-skills">
              <h3>核心技能</h3>
              <div class="skill-cards">
                <div
                  class="skill-card"
                  v-for="skill in mainSkills"
                  :key="skill.name"
                >
                  <div
                    class="skill-icon"
                    :style="{ backgroundColor: skill.color }"
                  >
                    <i :class="skill.icon"></i>
                  </div>
                  <div class="skill-info">
                    <h4>{{ skill.name }}</h4>
                    <el-progress
                      :percentage="skill.level"
                      :color="skill.color"
                      :show-text="false"
                    >
                    </el-progress>
                  </div>
                </div>
              </div>
            </div>

            <!-- 开发工具 -->
            <div class="skill-category dev-tools">
              <h3>开发工具</h3>
              <div class="tool-tags">
                <el-tag
                  v-for="tool in devTools"
                  :key="tool.name"
                  :type="tool.type"
                  effect="dark"
                  class="tool-tag"
                >
                  <i :class="tool.icon"></i>
                  {{ tool.name }}
                </el-tag>
              </div>
            </div>

            <!-- 其他技能 -->
            <div class="skill-category other-skills">
              <h3>其他技能</h3>
              <div class="skill-grid">
                <div
                  v-for="skill in otherSkills"
                  :key="skill.name"
                  class="skill-item"
                  :class="getSkillLevelClass(skill.level)"
                >
                  <div class="skill-header">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-level">{{ skill.level }}%</span>
                  </div>
                  <div class="skill-bar">
                    <div
                      class="skill-progress"
                      :style="{
                        width: skill.level + '%',
                        backgroundColor: getProgressColor(skill.level),
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="section">
          <h2 class="section-title">
            <i class="el-icon-trophy"></i>
            工作经历
          </h2>
          <el-timeline>
            <el-timeline-item
              v-for="(experience, index) in workExperience"
              :key="index"
              :timestamp="experience.period"
              placement="top"
            >
              <el-card>
                <h3>{{ experience.company }}</h3>
                <p class="job-title">{{ experience.title }}</p>
                <p class="job-description">{{ experience.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div> -->

        <div class="section">
          <h2 class="section-title">
            <i class="el-icon-chat-dot-round"></i>
            联系我
          </h2>
          <div class="contact-info">
            <p><i class="el-icon-message"></i> Email: lorry9475@gemail.com</p>
            <p><i class="el-icon-position"></i> GitHub: https://github.com/Liquor-Lorry</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      workExperience: [
        {
          period: "2022 - 至今",
          company: "XX科技有限公司",
          title: "高级前端开发工程师",
          description:
            "负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。",
        },
        {
          period: "2020 - 2022",
          company: "YY互联网公司",
          title: "前端开发工程师",
          description: "参与公司电商平台的开发，负责用户端和管理端的功能实现。",
        },
        {
          period: "2018 - 2020",
          company: "ZZ科技有限公司",
          title: "初级前端开发工程师",
          description: "参与公司官网和管理系统的开发，负责页面开发和性能优化。",
        },
      ],
      mainSkills: [
        {
          name: "Vue.js",
          level: 90,
          color: "#42b883",
          icon: "el-icon-data-analysis",
        },
        { name: "React", level: 85, color: "#61dafb", icon: "el-icon-share" },
        {
          name: "JavaScript",
          level: 95,
          color: "#f7df1e",
          icon: "el-icon-magic-stick",
        },
      ],
      devTools: [
        { name: "VS Code", icon: "el-icon-edit", type: "" },
        { name: "Webstorm", icon: "el-icon-box", type: "warning" },
        { name: "Trae", icon: "el-icon-data-line", type: "danger" },
        { name: "Git", icon: "el-icon-connection", type: "success" },
        { name: "Cursor", icon: "el-icon-set-up", type: "info" },
      ],
      otherSkills: [
        { name: "Vue", level: 95 },
        { name: "ES6", level: 85 },
        { name: "Node.js", level: 75 },
        { name: "HTML5", level: 95 },
        { name: "CSS3", level: 90 },
        { name: "TypeScript", level: 65 },
      ],
    };
  },
  methods: {
    getSkillLevelClass(level) {
      if (level >= 90) return "expert-level";
      if (level >= 80) return "advanced-level";
      if (level >= 70) return "intermediate-level";
      return "basic-level";
    },
    getProgressColor(level) {
      if (level >= 90) return "#67C23A"; // 绿色
      if (level >= 80) return "#409EFF"; // 蓝色
      if (level >= 70) return "#E6A23C"; // 橙色
      return "#F56C6C"; // 红色
    },
  },
};
</script>

<style lang="scss" scoped>
.about-container {
  .profile-card {
    .profile-header {
      text-align: center;
      padding: 20px 0;

      .avatar-wrapper {
        margin-bottom: 20px;
      }

      .name {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 10px;
      }

      .title {
        color: #666;
        margin: 0 0 15px;
      }

      .social-links {
        a {
          color: #666;
          font-size: 20px;
          margin: 0 10px;
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: #409eff;
          }
        }
      }
    }

    .profile-content {
      .section {
        margin-bottom: 30px;

        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 20px;
          display: flex;
          align-items: center;

          i {
            margin-right: 10px;
            color: #409eff;
          }
        }

        .description {
          color: #666;
          line-height: 1.6;
        }

        .skills {
          .skill-category {
            margin-bottom: 40px;

            h3 {
              font-size: 18px;
              color: #333;
              margin-bottom: 25px;
              position: relative;
              padding-left: 15px;

              &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 16px;
                background: #409eff;
                border-radius: 2px;
              }
            }

            // 主要技能卡片样式
            .skill-cards {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;

              .skill-card {
                display: flex;
                align-items: center;
                padding: 20px;
                background: #fff;
                border-radius: 10px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;

                &:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .skill-icon {
                  width: 50px;
                  height: 50px;
                  border-radius: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 15px;

                  i {
                    font-size: 24px;
                    color: #fff;
                  }
                }

                .skill-info {
                  flex: 1;

                  h4 {
                    margin: 0 0 10px;
                    font-size: 16px;
                    color: #333;
                  }
                }
              }
            }

            // 开发工具标签样式
            .tool-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;

              .tool-tag {
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 100px;

                i {
                  margin-right: 5px;
                  font-size: 16px;
                }
              }
            }

            // 其他技能网格样式
            .skill-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;

              .skill-item {
                background: #f5f7fa;
                padding: 15px;
                border-radius: 8px;
                transition: all 0.3s ease;

                &.expert-level {
                  background: #f0f9eb;
                  .skill-name {
                    color: #67c23a;
                  }
                }

                &.advanced-level {
                  background: #ecf5ff;
                  .skill-name {
                    color: #409eff;
                  }
                }

                &.intermediate-level {
                  background: #fdf6ec;
                  .skill-name {
                    color: #e6a23c;
                  }
                }

                &.basic-level {
                  background: #fef0f0;
                  .skill-name {
                    color: #f56c6c;
                  }
                }

                .skill-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 8px;

                  .skill-name {
                    font-weight: 500;
                    font-size: 14px;
                  }

                  .skill-level {
                    font-size: 14px;
                    color: #606266;
                  }
                }

                .skill-bar {
                  height: 6px;
                  background: #e4e7ed;
                  border-radius: 3px;
                  overflow: hidden;

                  .skill-progress {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.8s ease;
                  }
                }

                &:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                }
              }
            }
          }
        }

        .contact-info {
          p {
            margin: 10px 0;
            color: #666;

            i {
              margin-right: 10px;
              color: #409eff;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .about-container {
    .profile-card {
      .profile-content {
        .skills {
          .skill-category {
            .skill-cards {
              grid-template-columns: 1fr;
            }

            .skill-grid {
              grid-template-columns: 1fr;
            }

            .tool-tags {
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style> 
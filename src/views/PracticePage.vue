<template>
  <div class="practice-page">
    <div class="page-header">
      <div class="container">
        <h1>练习题</h1>
        <p>针对性练习，提高应试能力</p>
      </div>
    </div>

    <div class="container">
      <div class="practice-filters">
        <div class="filter-group">
          <label>等级</label>
          <div class="filter-buttons">
            <button 
              v-for="level in levels"
              :key="level"
              :class="['filter-btn', { active: currentLevel === level }]"
              @click="currentLevel = level"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>类型</label>
          <div class="filter-buttons">
            <button 
              v-for="type in types"
              :key="type"
              :class="['filter-btn', { active: currentType === type }]"
              @click="currentType = type"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <div class="practice-grid">
        <div v-for="type in filteredTypes" :key="type" class="question-type-group">
          <h3 class="type-title">{{ type }}</h3>
          <div class="questions-list">
            <div 
              v-for="question in getQuestionsByType(type)" 
              :key="question.questionBankId"
              class="question-card"
              @click="startPractice(question)"
            >
              <div :class="['question-id', getLevelClass(question.jlptLevel)]">
                {{ question.questionBankId }}
              </div>
              <div class="question-info">
                <h4 class="question-title">{{ question.question }}</h4>
                <p class="question-description">{{ getQuestionDescription(question) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Dialog -->
    <el-dialog
      v-model="showPurchaseDialog"
      title="开通会员"
      width="360px"
      center
      :show-close="false"
      class="purchase-dialog"
    >
      <div class="qr-container">
        <img src="https://images.pexels.com/photos/8737558/pexels-photo-8737558.jpeg?auto=compress&cs=tinysrgb&w=300" alt="客服二维码" class="qr-code">
        <p>扫码添加客服微信，开通会员</p>
        <p class="tip">开通会员后，手机APP也可同步使用</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPurchaseDialog = false">取消</el-button>
          <el-button type="primary" @click="downloadApp">
            下载APP
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Download Dialog -->
    <el-dialog
      v-model="showDownloadDialog"
      title="下载纯刷日语APP"
      width="360px"
      center
      :show-close="false"
      class="download-dialog"
    >
      <div class="download-options">
        <a href="/downloads/chunshua.apk" class="download-btn android">
          <i class="ri-android-line"></i>
          Android版下载
        </a>
        <a href="https://apps.apple.com/app/chunshua" target="_blank" class="download-btn ios">
          <i class="ri-apple-line"></i>
          iOS版下载
        </a>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDownloadDialog = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { questionBanks } from '../config/questionBanks'

const router = useRouter()
const authStore = useAuthStore()

const currentLevel = ref('全部')
const currentType = ref('全部')
const showPurchaseDialog = ref(false)
const showDownloadDialog = ref(false)

const levels = ['全部', 'N5', 'N4', 'N3', 'N2', 'N1']
const types = ['全部', '文字', '文法', '読解', '聴解']

const filteredQuestions = computed(() => {
  let filtered = questionBanks

  if (currentLevel.value !== '全部') {
    filtered = filtered.filter(q => q.jlptLevel === currentLevel.value)
  }

  if (currentType.value !== '全部') {
    filtered = filtered.filter(q => q.tixing === currentType.value)
  }

  return filtered
})

const filteredTypes = computed(() => {
  const types = new Set(filteredQuestions.value.map(q => q.tixing))
  return Array.from(types)
})

const getQuestionsByType = (type: string) => {
  return filteredQuestions.value.filter(q => q.tixing === type)
}

const getLevelClass = (level: string) => {
  return {
    'level-n1': level === 'N1',
    'level-n2': level === 'N2',
    'level-n3': level === 'N3',
    'level-n4': level === 'N4',
    'level-n5': level === 'N5'
  }
}

const getQuestionDescription = (question: any) => {
  // Add descriptions based on question type and content
  const descriptions: { [key: string]: string } = {
    '文字': '考察汉字读音、书写和词语用法',
    '文法': '测试语法规则和句子结构的掌握程度',
    '読解': '训练阅读理解和文章分析能力',
    '聴解': '提高听力理解和口语交际能力'
  }
  return descriptions[question.tixing] || ''
}

const startPractice = (question: any) => {
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: `/practice/${question.questionBankId}` }
    })
    return
  }

  const level = question.jlptLevel as keyof typeof authStore.permissions
  if (!authStore.hasPermission(level)) {
    showPurchaseDialog.value = true
    return
  }

  // Store question data in sessionStorage
  sessionStorage.setItem('currentQuestion', JSON.stringify(question))
  router.push(`/practice/${question.questionBankId}`)
}

const downloadApp = () => {
  showPurchaseDialog.value = false
  showDownloadDialog.value = true
}
</script>

<style lang="scss" scoped>
.practice-page {
  padding-bottom: var(--spacing-xxl);
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: 2rem;
    margin-bottom: var(--spacing-sm);
  }

  p {
    opacity: 0.9;
    font-size: 1.1rem;
  }
}

.practice-filters {
  background-color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.filter-group {
  flex: 1;
  min-width: 200px;

  label {
    display: block;
    font-weight: 500;
    margin-bottom: var(--spacing-sm);
    color: var(--text-light);
  }
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.9rem;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &.active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }
}

.practice-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.question-type-group {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.type-title {
  font-size: 1.3rem;
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.questions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.question-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
}

.question-id {
  padding: 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  min-width: 50px;
  text-align: center;

  &.level-n1 {
    background-color: #9C27B0;
  }

  &.level-n2 {
    background-color: #F44336;
  }

  &.level-n3 {
    background-color: #FF9800;
  }

  &.level-n4 {
    background-color: #2196F3;
  }

  &.level-n5 {
    background-color: #4CAF50;
  }
}

.question-info {
  flex: 1;
}

.question-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.question-description {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.4;
}

.purchase-dialog,
.download-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    text-align: center;
  }

  .qr-container {
    text-align: center;
    padding: var(--spacing-md) 0;

    .qr-code {
      width: 200px;
      height: 200px;
      margin-bottom: var(--spacing-md);
    }

    p {
      color: var(--text-color);
      margin-bottom: var(--spacing-xs);

      &.tip {
        color: var(--text-light);
        font-size: 0.9rem;
      }
    }
  }

  .download-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md) 0;
  }

  .download-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    text-decoration: none;
    color: white;
    font-weight: 500;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.9;
    }

    i {
      font-size: 1.2rem;
    }

    &.android {
      background-color: #3DDC84;
    }

    &.ios {
      background-color: #000000;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}
</style>
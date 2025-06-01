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
        <div 
          v-for="question in filteredQuestions" 
          :key="question.questionBankId"
          class="practice-card"
          @click="startPractice(question)"
        >
          <div class="card-header">
            <div class="level-badge">{{ question.jlptLevel }}</div>
            <div class="type-badge">{{ question.tixing }}</div>
          </div>
          
          <h3>{{ question.question }}</h3>
          
          <div class="card-footer">
            <button class="btn-start">
              开始练习
              <i class="ri-arrow-right-line"></i>
            </button>
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
import { questionBanks, type QuestionBank } from '../config/questionBanks'

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

const startPractice = (question: QuestionBank) => {
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.practice-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);

    .btn-start {
      background-color: var(--primary-dark);

      i {
        transform: translateX(4px);
      }
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.level-badge,
.type-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.level-badge {
  background-color: var(--primary-color);
  color: white;
}

.type-badge {
  background-color: var(--background-color);
  color: var(--text-color);
}

h3 {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-lg);
  line-height: 1.4;
}

.card-footer {
  margin-top: auto;
}

.btn-start {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  i {
    transition: transform var(--transition-fast);
  }
}

.purchase-dialog,
.download-dialog {
  :deep(.el-dialog__header)  {
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
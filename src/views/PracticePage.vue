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
          v-for="exam in paginatedExams" 
          :key="exam.id" 
          class="practice-card"
        >
          <div class="card-header">
            <div class="level-badge">{{ exam.level }}</div>
            <div class="exam-type">{{ exam.type }}</div>
          </div>
          
          <h3>{{ exam.title }}</h3>
          
          <div class="exam-meta">
            <div class="meta-item">
              <i class="ri-time-line"></i>
              <span>{{ exam.timeLimit }}分钟</span>
            </div>
            <div class="meta-item">
              <i class="ri-question-line"></i>
              <span>{{ getTotalQuestions(exam) }}题</span>
            </div>
          </div>
          
          <div class="exam-stats">
            <div class="stat-item">
              <div class="stat-label">平均正确率</div>
              <div class="stat-value">{{ exam.averageAccuracy }}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">完成人数</div>
              <div class="stat-value">{{ exam.completions }}</div>
            </div>
          </div>
          
          <button class="btn-start" @click="startPractice(exam)">
            开始练习
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="page-btn prev" 
          :disabled="currentPage === 1" 
          @click="prevPage"
        >
          <i class="ri-arrow-left-s-line"></i>
          上一页
        </button>
        <div class="page-numbers">
          <button 
            v-for="pageNum in displayedPages" 
            :key="pageNum"
            :class="['page-number', { active: currentPage === pageNum }]"
            @click="currentPage = pageNum"
          >
            {{ pageNum }}
          </button>
          <span v-if="showEllipsis" class="page-dots">...</span>
          <button 
            v-if="showLastPage"
            :class="['page-number', { active: currentPage === totalPages }]"
            @click="currentPage = totalPages"
          >
            {{ totalPages }}
          </button>
        </div>
        <button 
          class="page-btn next" 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
        >
          下一页
          <i class="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </div>

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
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const currentLevel = ref('全部')
const currentType = ref('全部')
const currentPage = ref(1)
const itemsPerPage = 10
const showPurchaseDialog = ref(false)
const showDownloadDialog = ref(false)

const levels = ['全部', 'N5', 'N4', 'N3', 'N2', 'N1']
const types = ['全部', '单词', '语法', '阅读', '听力']

const exams = ref([
  {
    id: 'n5-vocab-1',
    title: 'N5 单词练习 (1)',
    level: 'N5',
    type: '单词',
    timeLimit: 30,
    sections: [
      {
        id: 'section-1',
        title: '单词选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 85,
    completions: 1280
  },
  {
    id: 'n5-grammar-1',
    title: 'N5 语法练习 (1)',
    level: 'N5',
    type: '语法',
    timeLimit: 45,
    sections: [
      {
        id: 'section-1',
        title: '语法选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 78,
    completions: 960
  },
  {
    id: 'n4-vocab-1',
    title: 'N4 单词练习 (1)',
    level: 'N4',
    type: '单词',
    timeLimit: 30,
    sections: [
      {
        id: 'section-1',
        title: '单词选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 75,
    completions: 850
  },
  {
    id: 'n4-grammar-1',
    title: 'N4 语法练习 (1)',
    level: 'N4',
    type: '语法',
    timeLimit: 45,
    sections: [
      {
        id: 'section-1',
        title: '语法选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 72,
    completions: 720
  },
  {
    id: 'n3-vocab-1',
    title: 'N3 单词练习 (1)',
    level: 'N3',
    type: '单词',
    timeLimit: 30,
    sections: [
      {
        id: 'section-1',
        title: '单词选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 68,
    completions: 560
  },
  {
    id: 'n3-grammar-1',
    title: 'N3 语法练习 (1)',
    level: 'N3',
    type: '语法',
    timeLimit: 45,
    sections: [
      {
        id: 'section-1',
        title: '语法选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 65,
    completions: 480
  },
  {
    id: 'n2-vocab-1',
    title: 'N2 单词练习 (1)',
    level: 'N2',
    type: '单词',
    timeLimit: 30,
    sections: [
      {
        id: 'section-1',
        title: '单词选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 62,
    completions: 320
  },
  {
    id: 'n2-grammar-1',
    title: 'N2 语法练习 (1)',
    level: 'N2',
    type: '语法',
    timeLimit: 45,
    sections: [
      {
        id: 'section-1',
        title: '语法选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 58,
    completions: 280
  },
  {
    id: 'n1-vocab-1',
    title: 'N1 单词练习 (1)',
    level: 'N1',
    type: '单词',
    timeLimit: 30,
    sections: [
      {
        id: 'section-1',
        title: '单词选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 55,
    completions: 180
  },
  {
    id: 'n1-grammar-1',
    title: 'N1 语法练习 (1)',
    level: 'N1',
    type: '语法',
    timeLimit: 45,
    sections: [
      {
        id: 'section-1',
        title: '语法选择',
        questions: new Array(10).fill(null)
      }
    ],
    averageAccuracy: 52,
    completions: 150
  }
])

const filteredExams = computed(() => {
  let filtered = exams.value
  if (currentLevel.value !== '全部') {
    filtered = filtered.filter(exam => exam.level === currentLevel.value)
  }
  if (currentType.value !== '全部') {
    filtered = filtered.filter(exam => exam.type === currentType.value)
  }
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredExams.value.length / itemsPerPage))

const paginatedExams = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredExams.value.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(start + maxVisiblePages - 1, totalPages.value)

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > displayedPages.value[displayedPages.value.length - 1] + 1
})

const showLastPage = computed(() => {
  return totalPages.value > displayedPages.value[displayedPages.value.length - 1]
})

const getTotalQuestions = (exam: any) => {
  return exam.sections.reduce((total: number, section: any) => total + section.questions.length, 0)
}

const startPractice = (exam: any) => {
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: `/practice/${exam.id}` }
    })
    return
  }

  const level = exam.level as keyof typeof authStore.permissions
  if (!authStore.hasPermission(level)) {
    showPurchaseDialog.value = true
    return
  }

  router.push(`/practice/${exam.id}`)
}

const downloadApp = () => {
  showPurchaseDialog.value = false
  showDownloadDialog.value = true
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

.level-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

.exam-type {
  color: var(--text-light);
  font-size: 0.9rem;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-md);
}

.exam-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);

  .meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--text-light);
    font-size: 0.9rem;

    i {
      font-size: 1.1rem;
    }
  }
}

.exam-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.stat-item {
  text-align: center;

  .stat-label {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
  }
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

.purchase-dialog {
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
}

.download-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    text-align: center;
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
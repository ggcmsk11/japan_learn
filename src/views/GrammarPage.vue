<template>
  <div class="grammar-page">
    <div class="page-header">
      <div class="container">
        <h1>语法学习</h1>
        <p>系统掌握日语语法知识</p>
      </div>
    </div>

    <div class="container">
      <div class="grammar-filters">
        <div class="filter-group">
          <label>等级</label>
          <div class="filter-buttons">
            <button 
              v-for="level in levels"
              :key="level"
              :class="['filter-btn', { active: currentLevel === level }]"
              @click="setLevel(level)"
            >
              {{ level }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading && !grammarPoints.length" class="loading-state">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else-if="error" class="error-state">
        <i class="ri-error-warning-line"></i>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchGrammar">重试</button>
      </div>

      <div v-else class="grammar-grid">
        <div 
          v-for="point in grammarPoints" 
          :key="point.grammarId"
          class="grammar-card"
          @click="navigateToDetail(point)"
        >
          <div class="level-badge">{{ point.jlptLevel }}</div>
          <h3>{{ point.grammarName }}</h3>
          <p class="explanation">{{ point.grammarMeaning }}</p>
          
          <button class="btn-detail">
            查看详情
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>

      <div class="load-more" v-if="grammarPoints.length > 0">
        <button 
          class="btn btn-primary" 
          @click="loadMore"
          :disabled="loading"
        >
          {{ loading ? '加载中...' : '再来一组语法' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const API_URL = 'https://www.dlmy.tech/chunshua-api/chunshua_questions/grammar/grammerCards'

const getConfig = () => {
  return {
    userId: authStore.userInfo?.userId || '',
    token: authStore.token || '',
    user_phone: authStore.phoneNumber?.replace(/^\+/, '') || '',
    loginType: 0,
    useType: 2,
    userTypeUseGrammarId: 2025000241,
    jpltLevel: currentLevel.value === '全部' ? 'N' : currentLevel.value,
    grammarCount: 6
  }
}

interface GrammarPoint {
  grammarId: number
  grammarName: string
  grammarForm: string
  grammarMeaning: string
  exampleSentence1: string
  exampleTranslation1: string
  exampleSentence2: string
  exampleTranslation2: string
  exampleSentence3: string
  exampleTranslation3: string
  jlptLevel: string
}

const currentLevel = ref('全部')
const grammarPoints = ref<GrammarPoint[]>([])
const loading = ref(false)
const error = ref('')

const levels = ['全部', 'N5', 'N4', 'N3', 'N2', 'N1']

const setLevel = (level: string) => {
  currentLevel.value = level
  grammarPoints.value = []
  fetchGrammar()
}

const fetchGrammar = async () => {
  loading.value = true
  error.value = ''

  try {
    const config = getConfig()
    const response = await axios.post(API_URL, config)

    if (response.data.code === 200) {
      grammarPoints.value = response.data.data
    } else {
      throw new Error(response.data.msg || '获取语法失败')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取语法失败，请稍后重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  fetchGrammar()
}

const navigateToDetail = (grammar: GrammarPoint) => {
  router.push({
    path: `/grammar/${grammar.grammarId}`,
    state: { grammar }
  })
}

onMounted(() => {
  fetchGrammar()
})

// Provide grammar points to be used by detail page
provide('grammarPoints', grammarPoints)
</script>

<style lang="scss" scoped>
.grammar-page {
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

.grammar-filters {
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

.grammar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.grammar-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);

    .btn-detail {
      background-color: var(--primary-dark);

      i {
        transform: translateX(4px);
      }
    }
  }
}

.level-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

h3 {
  font-size: 1.3rem;
  margin-bottom: var(--spacing-md);
  padding-right: 60px;
}

.explanation {
  color: var(--text-light);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.btn-detail {
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

.loading-state,
.error-state {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.error-state {
  i {
    font-size: 3rem;
    color: var(--error-color);
    margin-bottom: var(--spacing-md);
  }

  p {
    color: var(--text-light);
    margin-bottom: var(--spacing-md);
  }
}

.load-more {
  text-align: center;
  margin-top: var(--spacing-xl);

  button {
    padding: 12px 30px;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}
</style>